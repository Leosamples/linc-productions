import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { isAuthorized, isBlobStoreUrl, unauthorized } from "@/lib/archive-auth";

export const dynamic = "force-dynamic";

// Removes replaced or deleted archive media from Blob. Only URLs in this
// app's Blob store are ever passed to del(); site paths and other hosts
// are ignored. Best effort: failures are logged, never surfaced.
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  let urls: unknown;
  try {
    urls = ((await request.json()) as { urls?: unknown }).urls;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!Array.isArray(urls)) return NextResponse.json({ error: "urls must be an array." }, { status: 400 });

  const targets = urls.filter((u): u is string => typeof u === "string" && isBlobStoreUrl(u));
  if (targets.length) {
    try {
      await del(targets);
    } catch (err) {
      console.error("Archive delete failed (ignored).", err);
    }
  }
  return NextResponse.json({ ok: true, deleted: targets.length }, { headers: { "Cache-Control": "no-store" } });
}
