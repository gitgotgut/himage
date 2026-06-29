import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { supabaseAdmin, PHOTO_BUCKET } from "@/lib/supabase";

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

  const buffer = Buffer.from(await file.arrayBuffer());

  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    // Non-fatal: store without dimensions.
  }

  const objectPath = `${params.id}/${randomUUID()}.${ext}`;
  const { error: uploadError } = await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .upload(objectPath, buffer, { contentType: file.type, upsert: false });

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
