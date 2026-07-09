import { createAuthMiddleware } from "@irate/bff";

// Gate the app shell on a session cookie; bounce logged-in users off /login.
export const middleware = createAuthMiddleware({
  protectedPrefixes: ["/dashboard", "/send", "/transactions", "/kyc", "/settings"],
  authPaths: ["/login", "/register"],
  loginPath: "/login",
  authedRedirect: "/dashboard",
});

export const config = {
  // Run on everything except static assets and the API routes (the proxy guards itself).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
