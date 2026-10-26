import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@irate/contracts";
import { applySession, resolveSession } from "./session";

export interface AuthProxyOptions {
  /** Route prefixes that require a session, e.g. ["/dashboard"]. */
  protectedPrefixes: string[];
  /** Pages signed-in users are bounced away from, e.g. ["/login"]. */
  authPaths?: string[];
  /** Where unauthenticated users are sent. */
  loginPath?: string;
  /** Where signed-in users hitting an auth page are sent. */
  authedRedirect?: string;
  /** Require this role on protected routes (e.g. "ADMIN"). */
  requiredRole?: UserRole;
}

const matches = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * Next.js `proxy` (formerly middleware) that guards page routes:
 * - protected routes need a session — with `requiredRole`, if set;
 * - signed-in users are redirected away from auth pages;
 * - an expired access token is renewed on the way through (see `resolveSession`).
 *
 * It reads JWT claims only to decide where to route. The backend verifies the
 * token on every API call, so this is UX, not the security boundary.
 */
export function createAuthProxy(options: AuthProxyOptions) {
  const {
    protectedPrefixes,
    authPaths = [],
    loginPath = "/login",
    authedRedirect = "/",
    requiredRole,
  } = options;

  return async function proxy(req: NextRequest): Promise<NextResponse> {
    const { pathname, search } = req.nextUrl;
    const isProtected = protectedPrefixes.some((p) => matches(pathname, p));
    const isAuthPath = authPaths.some((p) => matches(pathname, p));
    if (!isProtected && !isAuthPath) return NextResponse.next();

    const session = await resolveSession(req.cookies);
    const allowed = session.user !== null && (!requiredRole || session.user.role === requiredRole);

    let res: NextResponse;
    if (isProtected && !allowed) {
      const url = new URL(loginPath, req.url);
      // Signed in with the wrong role → explain; signed out → come back after login.
      if (session.user) url.searchParams.set("error", "forbidden");
      else url.searchParams.set("from", pathname + search);
      res = NextResponse.redirect(url);
    } else if (isAuthPath && allowed) {
      res = NextResponse.redirect(new URL(authedRedirect, req.url));
    } else {
      res = NextResponse.next();
    }

    applySession(res.cookies, session);
    return res;
  };
}
