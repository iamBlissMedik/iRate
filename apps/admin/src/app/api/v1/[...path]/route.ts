import { createProxyHandler } from "@irate/bff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Secure proxy: injects the ADMIN access token from the httpOnly cookie and
// refreshes transparently on 401. The browser never holds a token.
const handlers = createProxyHandler({ stripPrefix: "/api/v1" });

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
