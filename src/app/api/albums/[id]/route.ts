import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { albumUpdateSchema } from "@/lib/validations/album";

// GET /api/albums/[id] — album with photos and shared members
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { album, canView } = await loadAlbumForUser(params.id, session.user.id);
  if (!album || !canView) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const full = await prisma.album.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { id: true, displayName: true, email: true } },
      photos: {
        orderBy: { createdAt: "desc" },
        include: {
          uploader: { select: { id: true, displayName: true, email: true } },
        },
      },
      access: {
        include: {
          user: { select: { id: true, displayName: true, email: true } },
        },
      },
    },
  });

  return NextResponse.json(full);
}

// PATCH /api/albums/[id] — owner only
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { album, isOwner } = await loadAlbumForUser(params.id, session.user.id);
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = albumUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const updated = await prisma.album.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

// DELETE /api/albums/[id] — owner only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { album, isOwner } = await loadAlbumForUser(params.id, session.user.id);
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.album.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
