import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpClient, validateResponse } from "../http";
import { ApiError } from "../errors";

describe("validateResponse", () => {
  const schema = {
    safeParse: (d: unknown) =>
      d && typeof d === "object" && "id" in (d as object)
        ? { success: true as const, data: { id: (d as { id: string }).id } }
        : { success: false as const, error: { issues: ["missing id"] } },
  };

  it("returns the parsed data when valid", () => {
    expect(validateResponse({ id: "1", extra: 9 }, schema, "x")).toEqual({ id: "1" });
  });

  it("passes raw data through (does not throw) when invalid", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const raw = { wrong: true };
    expect(validateResponse(raw, schema, "x")).toBe(raw); // resilient passthrough
    warn.mockRestore();
  });

  it("is a no-op without a schema", () => {
    const raw = { anything: 1 };
    expect(validateResponse(raw, undefined, "x")).toBe(raw);
  });
});

function mockFetch(response: {
  ok: boolean;
  status: number;
  body: unknown;
}) {
  const fn = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
    new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("HttpClient", () => {
  it("unwraps the { success, message, data } envelope", async () => {
    mockFetch({ ok: true, status: 200, body: { success: true, message: "OK", data: { id: "1" } } });
    const client = new HttpClient();
    const result = await client.get<{ id: string }>("/users/me");
    expect(result).toEqual({ id: "1" });
  });

  it("throws a typed ApiError with field errors on validation failure", async () => {
    mockFetch({
      ok: false,
      status: 422,
      body: {
        success: false,
        message: "Validation failed",
        code: "VALIDATION",
        errors: [{ field: "email", message: "Invalid email" }],
      },
    });
    const client = new HttpClient();
    await expect(client.post("/auth/login", {})).rejects.toMatchObject({
      status: 422,
      code: "VALIDATION",
    });
    try {
      await client.post("/auth/login", {});
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).isValidation).toBe(true);
      expect((err as ApiError).toFieldRecord()).toEqual({ email: "Invalid email" });
    }
  });

  it("adds an Idempotency-Key to mutating requests", async () => {
    const fn = mockFetch({ ok: true, status: 200, body: { success: true, message: "", data: null } });
    const client = new HttpClient();
    await client.post("/transactions/transfer", { amount: 100 });
    const [, init] = fn.mock.calls[0] ?? [];
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBeTruthy();
  });

  it("invokes onUnauthorized for a 401", async () => {
    mockFetch({ ok: false, status: 401, body: { success: false, message: "Unauthorized" } });
    const onUnauthorized = vi.fn();
    const client = new HttpClient({ onUnauthorized });
    await expect(client.get("/users/me")).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
