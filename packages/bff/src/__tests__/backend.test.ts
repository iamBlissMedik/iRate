import { afterEach, describe, expect, it, vi } from "vitest";
import { extractAccessToken, parseSetCookie, refreshSession } from "../backend";

afterEach(() => vi.unstubAllGlobals());

describe("extractAccessToken", () => {
  it("reads a top-level accessToken", () => {
    expect(extractAccessToken({ accessToken: "abc" })).toBe("abc");
  });
  it("reads a nested data.accessToken", () => {
    expect(extractAccessToken({ data: { accessToken: "xyz" } })).toBe("xyz");
  });
  it("returns undefined when absent", () => {
    expect(extractAccessToken({ foo: 1 })).toBeUndefined();
    expect(extractAccessToken(undefined)).toBeUndefined();
  });
});

describe("parseSetCookie", () => {
  it("extracts a named cookie value from Set-Cookie headers", () => {
    const headers = [
      "other=1; Path=/",
      "refreshToken=secret-value; HttpOnly; Path=/; SameSite=Strict",
    ];
    expect(parseSetCookie(headers, "refreshToken")).toBe("secret-value");
  });
  it("returns undefined when the cookie isn't present", () => {
    expect(parseSetCookie(["a=b"], "refreshToken")).toBeUndefined();
  });
});

describe("refreshSession (single-flight)", () => {
  it("coalesces concurrent refreshes for the same token into one backend call", async () => {
    let resolveFetch: (r: Response) => void = () => {};
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((res) => {
          resolveFetch = res;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    // Two concurrent refreshes with the SAME token.
    const p1 = refreshSession("token-A");
    const p2 = refreshSession("token-A");

    resolveFetch(
      new Response(JSON.stringify({ data: { accessToken: "new" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const [r1, r2] = await Promise.all([p1, p2]);

    // Only ONE backend call despite two concurrent requests.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(extractAccessToken(r1.body)).toBe("new");
    expect(extractAccessToken(r2.body)).toBe("new");
  });

  it("allows a new refresh after the in-flight one settles", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ data: { accessToken: "t" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await refreshSession("token-B");
    await refreshSession("token-B");

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
