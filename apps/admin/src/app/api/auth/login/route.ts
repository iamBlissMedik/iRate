import { createLoginHandler } from "@irate/bff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin app: only ADMIN users may obtain a session here.
export const POST = createLoginHandler({ allowedRoles: ["ADMIN"] });
