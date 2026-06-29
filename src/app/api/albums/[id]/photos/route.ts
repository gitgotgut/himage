import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// POST /api/albums/[id]/photos — upload a photo (multipart form-data, field "file")
//
// NOTE: stores to the local public/uploads dir. Fine for development; swap to
// Vercel Blob / Cloudinary before deploying to a serverless host.
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
    return NextResponse.json(
      { error: "Unsupported image type" },
      { status: 400 }
    );
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

  const id = randomUUID();
  const dir = path.join(process.cwd(), "public", "uploads", "albums", params.id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.${ext}`), buffer);
  const url = `/uploads/albums/${params.id}/${id}.${ext}`;

  const photo = await prisma.photo.create({
    data: {
      albumId: params.id,
      uploaderId: session.user.id,
      url,
      caption,
      width,
      height,
    },
  });

  // Touch the album so it sorts to the top of the list.
  await prisma.album.update({
    where: { id: params.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(photo, { status: 201 });
}
