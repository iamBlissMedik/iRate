import { createProxyHandler } from "@irate/bff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Catch-all secure proxy: injects the access token from the httpOnly cookie,
// refreshes transparently on 401, and forwards to the real backend.
const handlers = createProxyHandler({ stripPrefix: "/api/v1" });

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
