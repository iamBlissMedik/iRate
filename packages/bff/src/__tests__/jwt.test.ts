import { describe, expect, it } from "vitest";
import { decodeJwtPayload, sessionUserFromToken } from "../jwt";

function b64url(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

/** Build a structurally-valid (unsigned) JWT for decoding tests. */
function makeToken(payload: Record<string, unknown>): string {
  return `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.signature`;
}

const future = Math.floor(Date.now() / 1000) + 3600;
const past = Math.floor(Date.now() / 1000) - 3600;

describe("decodeJwtPayload", () => {
  it("decodes the payload segment", () => {
    const token = makeToken({ sub: "u1", role: "USER", email: "ada@irate.dev", exp: future });
    expect(decodeJwtPayload(token)).toMatchObject({ sub: "u1", role: "USER" });
  });

  it("returns null for a malformed token", () => {
    expect(decodeJwtPayload("not-a-jwt")).toBeNull();
  });
});

describe("sessionUserFromToken", () => {
  it("maps standard claims to a session user", () => {
    const token = makeToken({ sub: "u1", role: "ADMIN", email: "admin@irate.dev", exp: future });
    expect(sessionUserFromToken(token)).toEqual({
      id: "u1",
      role: "ADMIN",
      email: "admin@irate.dev",
    });
  });

  it("falls back to userId / id claim names", () => {
    const token = makeToken({ userId: "u2", exp: future });
    expect(sessionUserFromToken(token)).toMatchObject({ id: "u2", role: "USER" });
  });

  it("treats an expired token as no session", () => {
    const token = makeToken({ sub: "u1", role: "USER", exp: past });
    expect(sessionUserFromToken(token)).toBeNull();
  });

  it("returns null when no subject claim is present", () => {
    const token = makeToken({ role: "USER", exp: future });
    expect(sessionUserFromToken(token)).toBeNull();
  });
});
