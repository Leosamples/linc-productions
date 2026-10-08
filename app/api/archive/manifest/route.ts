import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { get, list, put } from "@vercel/blob";
import { isAuthorized, unauthorized } from "@/lib/archive-auth";

export const dynamic = "force-dynamic";

const MANIFEST_PATH = "archive/manifest.json";
const MAX_MANIFEST_BYTES = 1_000_000;
const NO_STORE = { "Cache-Control": "no-store" };

// GET: the saved manifest from Blob if one exists, otherwise the default
// public/archive/manifest.json shipped with the site.
export async function GET() {
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { blobs } = await list({ prefix: MANIFEST_PATH, limit: 10 });
      const saved = blobs.find((b) => b.pathname === MANIFEST_PATH);
      if (saved) {
        // useCache: false reads from origin storage, so a save is visible
        // immediately instead of waiting for the CDN copy to expire.
        const result = await get(saved.url, { access: "public", useCache: false });
        if (result && result.statusCode === 200) {
          const text = await new Response(result.stream).text();
          return new NextResponse(text, {
            headers: { ...NO_STORE, "Content-Type": "application/json; charset=utf-8" },
          });
        }
      }
    }
  } catch (err) {
    console.error("Reading saved archive manifest failed; using the default.", err);
  }

  const fallback = await readFile(path.join(process.cwd(), "public", "archive", "manifest.json"), "utf8");
  return new NextResponse(fallback, {
    headers: { ...NO_STORE, "Content-Type": "application/json; charset=utf-8" },
  });
}

// POST: replace the saved manifest. Requires the admin password.
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  const raw = await request.text();
  if (raw.length > MAX_MANIFEST_BYTES) {
    return NextResponse.json({ error: "Manifest is too large." }, { status: 400, headers: NO_STORE });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON." }, { status: 400, headers: NO_STORE });
  }

  const problem = validateManifest(body);
  if (problem) return NextResponse.json({ error: problem }, { status: 400, headers: NO_STORE });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage isn't connected to this project yet, so changes can't be saved." },
      { status: 503, headers: NO_STORE }
    );
  }

  try {
    await put(MANIFEST_PATH, JSON.stringify(body), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  } catch (err) {
    console.error("Saving archive manifest failed.", err);
    return NextResponse.json({ error: "Could not save the manifest." }, { status: 500, headers: NO_STORE });
  }
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Media and links must be site paths or https URLs (no javascript: etc.).
function isSafeUrl(v: unknown): boolean {
  return typeof v === "string" && (v === "" || v.startsWith("/") || v.startsWith("https://"));
}

function validateManifest(body: unknown): string | null {
  if (!isObject(body)) return "Body must be an object.";
  if (!isObject(body.site)) return "site must be an object.";
  if (!isObject(body.intro)) return "intro must be an object.";
  if (!Array.isArray(body.shots)) return "shots must be an array.";

  if (body.intro.video !== undefined && !isSafeUrl(body.intro.video)) return "intro.video must be a path or https URL.";
  if (body.intro.playbackRate !== undefined && typeof body.intro.playbackRate !== "number") return "intro.playbackRate must be a number.";
  if (body.avatar !== undefined && !isSafeUrl(body.avatar)) return "avatar must be a path or https URL.";
  if (body.space !== undefined) {
    if (!isObject(body.space)) return "space must be an object.";
    if (body.space.earthVideo !== undefined && !isSafeUrl(body.space.earthVideo)) return "space.earthVideo must be a path or https URL.";
  }

  const menu = body.site.menu;
  if (menu !== undefined) {
    if (!Array.isArray(menu)) return "site.menu must be an array.";
    for (const item of menu) {
      if (!isObject(item)) return "Each menu item must be an object.";
      if (item.href !== undefined && !isSafeUrl(item.href)) return "Menu links must be paths or https URLs.";
    }
  }

  for (let i = 0; i < body.shots.length; i++) {
    const shot = body.shots[i];
    if (!isObject(shot)) return `shots[${i}] must be an object.`;
    if (typeof shot.src !== "string" || !shot.src || !isSafeUrl(shot.src)) return `shots[${i}].src must be a path or https URL.`;
    for (const key of ["thumb", "title", "place", "note"] as const) {
      if (shot[key] !== undefined && typeof shot[key] !== "string") return `shots[${i}].${key} must be a string.`;
    }
    if (shot.thumb !== undefined && !isSafeUrl(shot.thumb)) return `shots[${i}].thumb must be a path or https URL.`;
    if (shot.tall !== undefined && typeof shot.tall !== "boolean") return `shots[${i}].tall must be true or false.`;
    const allowed = new Set(["src", "thumb", "title", "place", "note", "tall"]);
    const extra = Object.keys(shot).find((k) => !allowed.has(k));
    if (extra) return `shots[${i}] has an unknown field "${extra}".`;
  }
  return null;
}
