/**
 * BFF configuration. These values are read **server-side only** and never
 * shipped to the browser. The browser talks exclusively to same-origin Next
 * routes; this module decides how those routes reach the real backend.
 */

export interface BffConfig {
  /** Real backend base URL incl. version, e.g. http://localhost:8000/api/v1 */
  backendBaseUrl: string;
  /** Cookie name the BFF uses for the access token (Next domain). */
  accessCookie: string;
  /** Cookie name the BFF uses for the refresh token (Next domain). */
  refreshCookie: string;
  /** Cookie name the BACKEND expects for the refresh token on /auth/refresh. */
  backendRefreshCookie: string;
  /** Access token cookie lifetime (seconds). Short — it is silently refreshed. */
  accessMaxAge: number;
  /** Refresh token cookie lifetime (seconds). */
  refreshMaxAge: number;
  /** Mark cookies Secure (true in production / behind HTTPS). */
  secure: boolean;
}

function env(key: string, fallback?: string): string {
  const v = process.env[key];
  if (v === undefined || v === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`[bff] Missing required env var ${key}`);
  }
  return v;
}

let cached: BffConfig | null = null;

export function getBffConfig(): BffConfig {
  if (cached) return cached;
  const isProd = process.env.NODE_ENV === "production";
  cached = {
    backendBaseUrl: env(
      "IRATE_API_BASE_URL",
      isProd ? undefined : "http://localhost:8000/api/v1",
    ).replace(/\/$/, ""),
    accessCookie: process.env.IRATE_ACCESS_COOKIE || "irate_at",
    refreshCookie: process.env.IRATE_REFRESH_COOKIE || "irate_rt",
    backendRefreshCookie: process.env.IRATE_BACKEND_REFRESH_COOKIE || "refreshToken",
    accessMaxAge: Number(process.env.IRATE_ACCESS_MAX_AGE || 60 * 15), // 15 min
    refreshMaxAge: Number(process.env.IRATE_REFRESH_MAX_AGE || 60 * 60 * 24 * 7), // 7 days
    secure: isProd,
  };
  return cached;
}
