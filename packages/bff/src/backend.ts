import { getBffConfig } from "./config";

export interface BackendResult<T = unknown> {
  status: number;
  ok: boolean;
  body: T;
  /** Refresh token value parsed out of the backend's Set-Cookie, if any. */
  refreshToken?: string;
  /** Raw text body, for transparent proxying. */
  raw: string;
}

/** Pull a cookie value out of a list of Set-Cookie header strings. */
export function parseSetCookie(setCookies: string[], name: string): string | undefined {
  for (const c of setCookies) {
    const match = c.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return undefined;
}

function getSetCookies(res: Response): string[] {
  const anyHeaders = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === "function") return anyHeaders.getSetCookie();
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

/** Low-level call to the real backend. Never throws on non-2xx. */
export async function callBackend<T = unknown>(
  path: string,
  init: {
    method?: string;
    body?: unknown;
    accessToken?: string;
    refreshToken?: string;
    headers?: Record<string, string>;
  } = {},
): Promise<BackendResult<T>> {
  const cfg = getBffConfig();
  const url = `${cfg.backendBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  // `Headers` is case-insensitive and `set` replaces: a forwarded browser
  // "content-type" plus our "Content-Type" must not merge into the invalid
  // "application/json, application/json" (strict backends answer 415).
  const headers = new Headers({ Accept: "application/json" });
  for (const [key, value] of Object.entries(init.headers ?? {})) headers.set(key, value);
  if (init.body !== undefined && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (init.accessToken) headers.set("Authorization", `Bearer ${init.accessToken}`);
  if (init.refreshToken) {
    // Present the refresh token the way the backend expects (httpOnly cookie).
    headers.set("Cookie", `${cfg.backendRefreshCookie}=${init.refreshToken}`);
  }

  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers,
    body:
      init.body === undefined
        ? undefined
        : init.body instanceof FormData
          ? init.body
          : JSON.stringify(init.body),
    // We manage cookies ourselves; do not let fetch persist them.
    redirect: "manual",
    cache: "no-store",
  });

  const raw = await res.text();
  let body: unknown = undefined;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
  }

  return {
    status: res.status,
    ok: res.ok,
    body: body as T,
    refreshToken: parseSetCookie(getSetCookies(res), cfg.backendRefreshCookie),
    raw,
  };
}

interface AuthEnvelope {
  data?: { accessToken?: string };
  accessToken?: string;
}

export function extractAccessToken(body: unknown): string | undefined {
  const e = body as AuthEnvelope | undefined;
  return e?.data?.accessToken ?? e?.accessToken;
}

/**
 * Single-flight refresh. When many requests 401 at once (same process), they
 * share ONE refresh call keyed by the refresh token instead of each firing their
 * own — preventing a thundering herd and races on the rotated refresh cookie.
 */
const refreshInFlight = new Map<string, Promise<BackendResult>>();

export function refreshSession(refreshToken: string): Promise<BackendResult> {
  const existing = refreshInFlight.get(refreshToken);
  if (existing) return existing;

  const p = callBackend("/auth/refresh", { method: "POST", refreshToken }).finally(() => {
    refreshInFlight.delete(refreshToken);
  });
  refreshInFlight.set(refreshToken, p);
  return p;
}
