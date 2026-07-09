import { createLogoutHandler } from "@irate/bff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createLogoutHandler();
