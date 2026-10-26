import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// Route handlers read cookies through next/headers, which needs a request
// scope; give them an in-memory jar instead.
const jar = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => void jar.set(name, value),
    delete: (name: string) => void jar.delete(name),
  }),
}));

const { createLoginHandler, createLogoutHandler, createProxyHandler, createRegisterHandler } =
  await import("../handlers");

const b64url = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const accessToken = `${b64url({ alg: "HS256" })}.${b64url({
  sub: "u1",
  email: "ada@irate.dev",
  role: "USER",
  exp: Math.floor(Date.now() / 1000) + 900,
})}.sig`;

/** Stub the API and capture the headers each call sent. */
function stubApi(body: unknown = { success: true, data: { accessToken } }) {
  const calls: { url: string; headers: Headers }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, headers: new Headers(init.headers) });
      return new Response(JSON.stringify(body), { status: 200 });
    }),
  );
  return calls;
}

/** Headers of the only API call made (fails loudly if there wasn't exactly one). */
function sentHeaders(calls: { headers: Headers }[]): Headers {
  const [call, ...rest] = calls;
  if (!call || rest.length > 0) throw new Error(`expected one API call, got ${calls.length}`);
  return call.headers;
}

const post = (path: string, headers: Record<string, string>, body: unknown = {}) =>
  new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

beforeEach(() => jar.clear());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("client IP forwarding", () => {
  it("login forwards the browser's IP as a single X-Forwarded-For entry", async () => {
    const calls = stubApi();
    await createLoginHandler()(
      post(
        "/api/auth/login",
        { "x-forwarded-for": "203.0.113.7" },
        { email: "a@b.co", password: "x" },
      ),
    );

    expect(calls[0]?.url).toMatch(/\/auth\/login$/);
    expect(sentHeaders(calls).get("x-forwarded-for")).toBe("203.0.113.7");
  });

  it("register forwards it too", async () => {
    const calls = stubApi({ success: true, data: { user: {} } });
    await createRegisterHandler()(post("/api/auth/register", { "x-forwarded-for": "203.0.113.8" }));
    expect(sentHeaders(calls).get("x-forwarded-for")).toBe("203.0.113.8");
  });

  it("logout forwards it (audit logs show who ended the session)", async () => {
    const calls = stubApi({ success: true, data: null });
    jar.set("irate_rt", "refresh-token");
    await createLogoutHandler()(post("/api/auth/logout", { "x-forwarded-for": "203.0.113.9" }));
    expect(sentHeaders(calls).get("x-forwarded-for")).toBe("203.0.113.9");
  });

  it("sends nothing rather than a value it can't trust", async () => {
    const calls = stubApi();
    await createLoginHandler()(
      post(
        "/api/auth/login",
        { "x-forwarded-for": "not-an-ip" },
        { email: "a@b.co", password: "x" },
      ),
    );
    expect(sentHeaders(calls).has("x-forwarded-for")).toBe(false);
  });

  it("the API proxy replaces the browser's address headers with the resolved IP", async () => {
    const calls = stubApi({ success: true, data: [] });
    jar.set("irate_at", accessToken);
    const { POST } = createProxyHandler();

    await POST(
      post("/api/v1/transactions/transfer", {
        "x-forwarded-for": "6.6.6.6, 203.0.113.7",
        "x-real-ip": "6.6.6.6",
        forwarded: "for=6.6.6.6",
        "x-forwarded-host": "evil.example",
        "idempotency-key": "key-12345678",
      }),
    );

    const sent = sentHeaders(calls);
    // hops = 0 in tests: the last entry is the one Next.js / our proxy recorded.
    expect(sent.get("x-forwarded-for")).toBe("203.0.113.7");
    expect(sent.has("x-real-ip")).toBe(false);
    expect(sent.has("forwarded")).toBe(false);
    expect(sent.has("x-forwarded-host")).toBe(false);
    // Ordinary headers still pass through.
    expect(sent.get("idempotency-key")).toBe("key-12345678");
    expect(sent.get("authorization")).toBe(`Bearer ${accessToken}`);
  });
});
