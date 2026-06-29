import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { supabaseAdmin, PHOTO_BUCKET } from "@/lib/supabase";

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

  // Best-effort removal from storage; the DB record is the source of truth.
  await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .remove([photo.url])
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
