import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { callBackend } from "../backend";
import { createAuthProxy } from "../proxy";

afterEach(() => vi.unstubAllGlobals());

const b64url = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const exp = (offsetSeconds: number) => Math.floor(Date.now() / 1000) + offsetSeconds;
const token = (role: "ADMIN" | "USER", expiresIn = 3600) =>
  `${b64url({ alg: "HS256" })}.${b64url({ sub: "u1", email: "a@b.c", role, exp: exp(expiresIn) })}.sig`;

function request(path: string, cookies: Record<string, string> = {}) {
  const cookie = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  return new NextRequest(`http://localhost${path}`, { headers: cookie ? { cookie } : {} });
}

/** Stub the backend's /auth/refresh response. */
function stubRefresh(status: number, accessToken?: string) {
  const body = accessToken ? { success: true, data: { accessToken } } : { success: false };
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "set-cookie": "refreshToken=rotated; HttpOnly; Path=/" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const adminProxy = createAuthProxy({
  protectedPrefixes: ["/dashboard"],
  authPaths: ["/login"],
  authedRedirect: "/dashboard",
  requiredRole: "ADMIN",
});

describe("createAuthProxy", () => {
  it("sends signed-out users to login with a return path", async () => {
    const res = await adminProxy(request("/dashboard/users?page=2"));
    expect(res.headers.get("location")).toBe(
      "http://localhost/login?from=%2Fdashboard%2Fusers%3Fpage%3D2",
    );
  });

  it("lets an admin through and bounces them off /login", async () => {
    const ok = await adminProxy(request("/dashboard", { irate_at: token("ADMIN") }));
    expect(ok.headers.get("location")).toBeNull();
    const bounced = await adminProxy(request("/login", { irate_at: token("ADMIN") }));
    expect(bounced.headers.get("location")).toBe("http://localhost/dashboard");
  });

  it("does not loop for a signed-in user with the wrong role", async () => {
    const cookies = { irate_at: token("USER") };
    const denied = await adminProxy(request("/dashboard", cookies));
    expect(denied.headers.get("location")).toBe("http://localhost/login?error=forbidden");
    // The login page must render for them instead of bouncing back to /dashboard.
    const login = await adminProxy(request("/login?error=forbidden", cookies));
    expect(login.headers.get("location")).toBeNull();
  });

  it("renews an expired access token with the refresh token", async () => {
    stubRefresh(200, token("ADMIN"));
    const res = await adminProxy(request("/dashboard", { irate_rt: "old-refresh" }));
    expect(res.headers.get("location")).toBeNull();
    const setCookie = res.headers.getSetCookie().join("\n");
    expect(setCookie).toContain("irate_at=");
    expect(setCookie).toContain("irate_rt=rotated");
  });

  it("clears the cookies when the refresh token is rejected", async () => {
    stubRefresh(401);
    const res = await adminProxy(request("/dashboard", { irate_rt: "revoked" }));
    expect(res.headers.get("location")).toContain("/login?from=");
    expect(res.headers.getSetCookie().join("\n")).toMatch(
      /irate_rt=;.*Max-Age=0|irate_rt=;.*Expires=/i,
    );
  });

  it("keeps the cookies when the backend is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("fetch failed"))),
    );
    const res = await adminProxy(request("/dashboard", { irate_rt: "still-valid" }));
    expect(res.headers.getSetCookie()).toEqual([]);
  });

  it("ignores routes it doesn't guard", async () => {
    const fetchMock = stubRefresh(200, token("ADMIN"));
    const res = await adminProxy(request("/about", { irate_rt: "x" }));
    expect(res.headers.get("location")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("callBackend", () => {
  it("turns a network failure into a 502 envelope instead of throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("fetch failed"))),
    );
    const result = await callBackend("/users/me");
    expect(result.status).toBe(502);
    expect(JSON.parse(result.raw)).toMatchObject({ success: false });
  });
});
