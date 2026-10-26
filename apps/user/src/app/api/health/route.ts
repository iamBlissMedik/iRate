import { NextResponse } from "next/server";

/** Liveness probe for the hosting platform. */
export function GET() {
  return NextResponse.json({ status: "ok" });
}
