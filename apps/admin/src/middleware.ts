import { createAuthMiddleware } from "@irate/bff";

// ADMIN-gated route protection. Replaces the previous NextAuth `withAuth`.
// Tokens live in httpOnly cookies; this only checks presence + role to decide
// whether to render the protected shell.
export const middleware = createAuthMiddleware({
  protectedPrefixes: ["/dashboard"],
  authPaths: ["/login"],
  loginPath: "/login",
  authedRedirect: "/dashboard",
  requiredRole: "ADMIN",
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
