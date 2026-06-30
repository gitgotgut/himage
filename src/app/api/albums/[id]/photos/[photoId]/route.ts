import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { supabaseAdmin, PHOTO_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

const captionSchema = z.object({
  caption: z.string().trim().max(500).optional().or(z.literal("")),
});

// PATCH /api/albums/[id]/photos/[photoId] — edit caption (owner or uploader)
export async function PATCH(
  req: NextRequest,
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

  const body = await req.json().catch(() => null);
  const parsed = captionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid caption" }, { status: 400 });
  }

  const updated = await prisma.photo.update({
    where: { id: params.photoId },
    data: { caption: parsed.data.caption ? parsed.data.caption : null },
    select: { id: true, caption: true },
  });

  return NextResponse.json(updated);
}

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
