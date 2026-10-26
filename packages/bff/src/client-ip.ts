import { isIP } from "node:net";
import { getBffConfig } from "./config";

/**
 * The browser's IP address, for the API's per-IP rate limits and audit logs.
 *
 * Why this exists: the BFF calls the API server-to-server, so without help the
 * API sees every customer as the BFF's own IP. One shared IP means one shared
 * login rate limit, and a single attacker could lock everyone out. So the BFF
 * works out the real client IP and sends it as a fresh `X-Forwarded-For`.
 *
 * Why it can't just copy the browser's header: `X-Forwarded-For` is a list
 * that each proxy APPENDS to (`client, proxy1, proxy2`). The left part can be
 * anything the client typed; only entries added by proxies we control are
 * trustworthy. With `hops` trusted proxies in front of Next.js, the entry the
 * outermost one added (the address it actually saw) is `hops` from the right.
 * This is the same rule as Express's `trust proxy` setting.
 *
 * With `hops = 0` (no proxy, e.g. `next start` in development) Next.js fills
 * the header with the socket address, but only when the request didn't already
 * carry one, so a client can choose its own value there. Production deployments
 * should sit behind a proxy and set IRATE_TRUSTED_PROXY_HOPS to match.
 */
export function resolveClientIp(
  headers: Headers,
  hops = getBffConfig().trustedProxyHops,
): string | undefined {
  const chain = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  // Fewer entries than trusted proxies means the request didn't come through
  // them (or the setting is wrong): there's nothing we can trust.
  const index = chain.length - Math.max(hops, 1);
  if (index < 0) return undefined;
  return normalizeIp(chain[index]);
}

/**
 * Headers to send the API so it sees the browser's IP: a single-entry
 * `X-Forwarded-For` (never the client's raw chain). The API should trust
 * exactly one hop (`TRUST_PROXY_HOPS=1` / `trust proxy = 1`) and must only be
 * reachable from the BFF, otherwise callers could set the header themselves.
 */
export function clientIpHeaders(headers: Headers): Record<string, string> {
  const ip = resolveClientIp(headers);
  return ip ? { "X-Forwarded-For": ip } : {};
}

/** Accepts `1.2.3.4`, `1.2.3.4:5678`, `::1`, `[::1]:5678`; anything else is rejected. */
function normalizeIp(entry: string | undefined): string | undefined {
  if (!entry) return undefined;
  let candidate = entry;
  const bracketed = /^\[([^\]]+)\](?::\d+)?$/.exec(candidate)?.[1];
  if (bracketed) candidate = bracketed;
  else if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(candidate))
    candidate = candidate.replace(/:\d+$/, "");
  return isIP(candidate) ? candidate : undefined;
}
