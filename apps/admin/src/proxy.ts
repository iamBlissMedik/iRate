import { createAuthProxy } from "@irate/bff";

// Route guard: the console requires an ADMIN session; signed-in admins skip /login.
export const proxy = createAuthProxy({
  protectedPrefixes: ["/dashboard"],
  authPaths: ["/login"],
  authedRedirect: "/dashboard",
  requiredRole: "ADMIN",
});

export const config = {
  // Pages only — API routes guard themselves and static assets need no session.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
