import type { AuthUser, UserRole } from "@irate/contracts";

/**
 * Decode (NOT verify) a JWT payload. Safe here because the token lives in our
 * own httpOnly cookie and the backend cryptographically verifies it on every
 * proxied call — we only read claims to render the session user client-side.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Build the public session user from access-token claims. */
export function sessionUserFromToken(token: string): AuthUser | null {
  const claims = decodeJwtPayload(token);
  if (!claims) return null;

  const id = (claims.sub ?? claims.userId ?? claims.id) as string | undefined;
  if (!id) return null;

  const role = (claims.role as UserRole) ?? "USER";
  const email = (claims.email as string) ?? "";

  // Treat an expired token as no session.
  if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
    return null;
  }

  return { id, email, role };
}
