import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@irate/contracts";
import { getBffConfig } from "./config";
import { sessionUserFromToken } from "./jwt";

export interface AuthMiddlewareOptions {
  /** Path to redirect unauthenticated users to. */
  loginPath?: string;
  /** Route prefixes that require a session. */
  protectedPrefixes: string[];
  /** Paths that authenticated users should be bounced away from (e.g. /login). */
  authPaths?: string[];
  /** Where to send an already-authenticated user hitting an auth path. */
  authedRedirect?: string;
  /** Require this role on protected routes (e.g. "ADMIN"). */
  requiredRole?: UserRole;
}

/**
 * Edge middleware factory: gates protected routes on the presence of the access
 * (or refresh) cookie. It does not verify the JWT — the backend does that on
 * every proxied call — it only prevents rendering protected shells while logged
 * out, and redirects logged-in users away from /login.
 */
export function createAuthMiddleware(options: AuthMiddlewareOptions) {
  const loginPath = options.loginPath ?? "/login";
  const authedRedirect = options.authedRedirect ?? "/";

  return function middleware(req: NextRequest): NextResponse {
    const cfg = getBffConfig();
    const { pathname, search } = req.nextUrl;
    const hasSession =
      Boolean(req.cookies.get(cfg.accessCookie)?.value) ||
      Boolean(req.cookies.get(cfg.refreshCookie)?.value);

    const isProtected = options.protectedPrefixes.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    const isAuthPath = (options.authPaths ?? []).some((p) => pathname.startsWith(p));

    if (isProtected && !hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = loginPath;
      url.search = `?from=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    // Role gate: a session with the wrong role is treated as no access.
    if (isProtected && hasSession && options.requiredRole) {
      const token = req.cookies.get(cfg.accessCookie)?.value;
      const user = token ? sessionUserFromToken(token) : null;
      if (!user || user.role !== options.requiredRole) {
        const url = req.nextUrl.clone();
        url.pathname = loginPath;
        url.search = `?error=forbidden`;
        return NextResponse.redirect(url);
      }
    }

    if (isAuthPath && hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = authedRedirect;
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  };
}
