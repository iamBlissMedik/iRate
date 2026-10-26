import type { NextResponse } from "next/server";
import { getBffConfig } from "./config";

/**
 * Anything that can set/delete cookies: the `cookies()` store in route
 * handlers, or `response.cookies` in the proxy.
 */
export type CookieWriter = Pick<NextResponse["cookies"], "set" | "delete">;

/** Anything that can read cookies: the `cookies()` store or `request.cookies`. */
export interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const baseOptions = (secure: boolean) =>
  ({ httpOnly: true, secure, sameSite: "lax", path: "/" }) as const;

/** Read the BFF's session cookies. */
export function readAuthCookies(store: CookieReader): AuthTokens {
  const cfg = getBffConfig();
  return {
    accessToken: store.get(cfg.accessCookie)?.value,
    refreshToken: store.get(cfg.refreshCookie)?.value,
  };
}

/** Persist tokens as httpOnly cookies on the Next.js domain. */
export function setAuthCookies(store: CookieWriter, tokens: AuthTokens) {
  const cfg = getBffConfig();
  if (tokens.accessToken) {
    store.set(cfg.accessCookie, tokens.accessToken, {
      ...baseOptions(cfg.secure),
      maxAge: cfg.accessMaxAge,
    });
  }
  if (tokens.refreshToken) {
    store.set(cfg.refreshCookie, tokens.refreshToken, {
      ...baseOptions(cfg.secure),
      // Never sent on cross-site requests, not even top-level navigations.
      sameSite: "strict",
      maxAge: cfg.refreshMaxAge,
    });
  }
}

export function clearAuthCookies(store: CookieWriter) {
  const cfg = getBffConfig();
  store.delete(cfg.accessCookie);
  store.delete(cfg.refreshCookie);
}
