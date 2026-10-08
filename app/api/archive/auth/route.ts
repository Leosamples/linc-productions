import { NextResponse } from "next/server";
import { isAuthorized, unauthorized } from "@/lib/archive-auth";

export const dynamic = "force-dynamic";

// Lets the edit-mode unlock form check a password before anything is changed.
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
