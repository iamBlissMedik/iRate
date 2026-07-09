import { cookies } from "next/headers";
import { getBffConfig } from "./config";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

const baseOptions = (secure: boolean) =>
  ({
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
  }) as const;

export async function getAccessToken(): Promise<string | undefined> {
  const cfg = getBffConfig();
  const store = await cookies();
  return store.get(cfg.accessCookie)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cfg = getBffConfig();
  const store = await cookies();
  return store.get(cfg.refreshCookie)?.value;
}

/** Persist tokens as httpOnly cookies on the Next.js domain. */
export function setAuthCookies(
  store: CookieStore,
  tokens: { accessToken?: string; refreshToken?: string },
) {
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
      // Refresh token only ever travels to /api/auth/* and the proxy refresh.
      sameSite: "strict",
      maxAge: cfg.refreshMaxAge,
    });
  }
}

export function clearAuthCookies(store: CookieStore) {
  const cfg = getBffConfig();
  store.delete(cfg.accessCookie);
  store.delete(cfg.refreshCookie);
}
