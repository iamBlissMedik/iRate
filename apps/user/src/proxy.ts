import { createAuthProxy } from "@irate/bff";

// Route guard: the wallet needs a session; signed-in users skip /login and /register.
export const proxy = createAuthProxy({
  protectedPrefixes: ["/dashboard", "/send", "/transactions", "/kyc", "/settings"],
  authPaths: ["/login", "/register"],
  authedRedirect: "/dashboard",
});

export const config = {
  // Pages only — API routes guard themselves and static assets need no session.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
