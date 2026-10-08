import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

// Shared helpers for the /api/archive/* routes.
// ADMIN_PASSWORD is a server-only environment variable; it is never sent
// to the browser. If it isn't set, every write is refused.

export const PASSWORD_HEADER = "x-admin-password";

export function passwordMatches(candidate: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !candidate) return false;
  // Hash both sides so the buffers are always the same length, which
  // timingSafeEqual requires, without leaking the password length.
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function isAuthorized(request: Request): boolean {
  return passwordMatches(request.headers.get(PASSWORD_HEADER));
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

// Only files in this app's Vercel Blob store may ever be deleted.
export function isBlobStoreUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}
