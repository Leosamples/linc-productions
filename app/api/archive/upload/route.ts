import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { passwordMatches } from "@/lib/archive-auth";

export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_VIDEO_BYTES = 150 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

class UnauthorizedError extends Error {}
class BadPathError extends Error {}

// Issues short-lived client-upload tokens for the archive edit mode.
// The browser sends the admin password as the clientPayload.
export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Check the password before handleUpload, which otherwise touches the
  // Blob token first. (Checked again in onBeforeGenerateToken below.)
  if (body?.type === "blob.generate-client-token" && !passwordMatches(body.payload?.clientPayload)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage isn't connected to this project yet, so files can't be uploaded." },
      { status: 503 }
    );
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!passwordMatches(clientPayload)) throw new UnauthorizedError();
        const isVideo = pathname.startsWith("archive/video/");
        const isPhoto = pathname.startsWith("archive/photos/");
        if (!isVideo && !isPhoto) throw new BadPathError();
        return {
          allowedContentTypes: isVideo ? VIDEO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES,
          // Every upload gets a unique name, so replacements never collide.
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof BadPathError) {
      return NextResponse.json({ error: "Uploads must go to archive/photos/ or archive/video/." }, { status: 400 });
    }
    console.error("Archive upload token failed.", err);
    return NextResponse.json({ error: "Upload could not be started." }, { status: 400 });
  }
}
