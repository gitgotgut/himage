import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";

export const runtime = "nodejs";

// DELETE /api/albums/[id]/photos/[photoId] — album owner or the uploader
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; photoId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { album, isOwner } = await loadAlbumForUser(params.id, session.user.id);
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const photo = await prisma.photo.findUnique({ where: { id: params.photoId } });
  if (!photo || photo.albumId !== params.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isOwner && photo.uploaderId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.photo.delete({ where: { id: params.photoId } });

  // Best-effort removal of the file on disk.
  try {
    await unlink(path.join(process.cwd(), "public", photo.url));
  } catch {
    // Ignore — the DB record is the source of truth.
  }

  return NextResponse.json({ ok: true });
}
