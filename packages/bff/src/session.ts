import type { AuthUser } from "@irate/contracts";
import { extractAccessToken, refreshSession, type BackendResult } from "./backend";
import {
  clearAuthCookies,
  readAuthCookies,
  setAuthCookies,
  type AuthTokens,
  type CookieReader,
  type CookieWriter,
} from "./cookies";
import { sessionUserFromToken } from "./jwt";

export interface ResolvedSession {
  user: AuthUser | null;
  /** New tokens minted from the refresh token — persist them on the response. */
  renewed?: AuthTokens;
  /** The backend rejected the refresh token — clear the dead cookies. */
  expired?: boolean;
}

/** The backend refused the refresh token (as opposed to being unreachable). */
export const isRejected = (result: BackendResult) => result.status >= 400 && result.status < 500;

/**
 * Work out who is signed in from the session cookies. A missing or expired
 * access token is renewed with the refresh token, so a session lasts as long
 * as the refresh token rather than the 15-minute access cookie.
 */
export async function resolveSession(cookies: CookieReader): Promise<ResolvedSession> {
  const { accessToken, refreshToken } = readAuthCookies(cookies);

  const user = accessToken ? sessionUserFromToken(accessToken) : null;
  if (user) return { user };
  if (!refreshToken) return { user: null };

  const result = await refreshSession(refreshToken);
  const renewedAccess = result.ok ? extractAccessToken(result.body) : undefined;
  const renewedUser = renewedAccess ? sessionUserFromToken(renewedAccess) : null;
  if (!renewedAccess || !renewedUser) return { user: null, expired: isRejected(result) };

  return {
    user: renewedUser,
    renewed: { accessToken: renewedAccess, refreshToken: result.refreshToken },
  };
}

/** Write the outcome of {@link resolveSession} back to the cookie jar. */
export function applySession(store: CookieWriter, session: ResolvedSession) {
  if (session.renewed) setAuthCookies(store, session.renewed);
  else if (session.expired) clearAuthCookies(store);
}
