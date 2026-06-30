import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { supabaseAdmin, PHOTO_BUCKET } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// POST /api/albums/[id]/photos — upload a photo to the Supabase Storage bucket.
// Photo.url stores the object PATH (not a URL); signed URLs are generated at
// render time so private albums stay private.
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await rateLimit("upload", session.user.id, 60, 60))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { album, canContribute } = await loadAlbumForUser(
    params.id,
    session.user.id
  );
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canContribute) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const caption = (form?.get("caption") as string | null)?.trim() || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than 10 MB" },
      { status: 400 }
    );
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  // Decode + validate the actual bytes (not the client-supplied MIME). Raster
  // formats are re-encoded to strip EXIF/GPS metadata and bound dimensions,
  // which also defends against EXIF leaks and decompression bombs. Anything
  // that isn't a real image of the declared type is rejected here.
  let outputBuffer: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  try {
    if (file.type === "image/gif") {
      const meta = await sharp(inputBuffer, { animated: true }).metadata();
      if (meta.format !== "gif") throw new Error("not a gif");
      width = meta.width;
      height = meta.pageHeight ?? meta.height;
      outputBuffer = inputBuffer; // GIFs carry no GPS EXIF; store as-is
    } else {
      const pipeline = sharp(inputBuffer)
        .rotate() // apply EXIF orientation; output then drops all metadata
        .resize({ width: 4000, height: 4000, fit: "inside", withoutEnlargement: true });
      outputBuffer =
        file.type === "image/png"
          ? await pipeline.png().toBuffer()
          : file.type === "image/webp"
          ? await pipeline.webp({ quality: 85 }).toBuffer()
          : await pipeline.jpeg({ quality: 85 }).toBuffer();
      const meta = await sharp(outputBuffer).metadata();
      width = meta.width;
      height = meta.height;
    }
  } catch {
    return NextResponse.json(
      { error: "File is not a valid image" },
      { status: 400 }
    );
  }

  const objectPath = `${params.id}/${randomUUID()}.${ext}`;
  const { error: uploadError } = await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .upload(objectPath, outputBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }

  const photo = await prisma.photo.create({
    data: {
      albumId: params.id,
      uploaderId: session.user.id,
      url: objectPath,
      caption,
      width,
      height,
    },
  });

  await prisma.album.update({
    where: { id: params.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(photo, { status: 201 });
}
