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
  /**
   * How many reverse proxies sit in front of this Next.js app (Vercel, nginx, a
   * load balancer...). Used to find the browser's real IP in X-Forwarded-For,
   * which the BFF forwards to the API for per-IP rate limits and audit logs.
   * See client-ip.ts.
   */
  trustedProxyHops: number;
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
    trustedProxyHops: proxyHops(process.env.IRATE_TRUSTED_PROXY_HOPS),
  };
  return cached;
}

function proxyHops(raw: string | undefined): number {
  if (raw === undefined || raw === "") return 0;
  const hops = Number(raw);
  if (!Number.isInteger(hops) || hops < 0 || hops > 10) {
    throw new Error(`[bff] IRATE_TRUSTED_PROXY_HOPS must be an integer from 0 to 10, got "${raw}"`);
  }
  return hops;
}
