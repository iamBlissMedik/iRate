import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect root `/` → `/dashboard`
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect logged-in users away from login or register
    if (pathname.startsWith("/login") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 🔹 Protect all other routes (requires token)
    const isProtected = !["/login"].includes(pathname);
    if (isProtected && !token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // middleware runs for all matched routes
    },
  }
);

export const config = {
  matcher: [
    // Apply middleware to all routes except public/static/auth routes
    "/((?!_next|favicon.ico|public|api/auth|api).*)",
  ],
};
