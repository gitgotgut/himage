import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { shareSchema } from "@/lib/validations/album";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/albums/[id]/access — owner shares the album with another user by email
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await rateLimit("share", session.user.id, 20, 60))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { album, isOwner } = await loadAlbumForUser(params.id, session.user.id);
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = shareSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: { id: true, displayName: true, email: true },
  });
  if (!user) {
    return NextResponse.json(
      { error: "No hifamily member with that email" },
      { status: 404 }
    );
  }
  if (user.id === album.ownerId) {
    return NextResponse.json(
      { error: "You already own this album" },
      { status: 400 }
    );
  }

  const access = await prisma.albumAccess.upsert({
    where: { albumId_userId: { albumId: params.id, userId: user.id } },
    create: { albumId: params.id, userId: user.id },
    update: {},
    include: {
      user: { select: { id: true, displayName: true, email: true } },
    },
  });

  return NextResponse.json(access, { status: 201 });
}

// DELETE /api/albums/[id]/access?userId=... — owner removes a shared member
export async function DELETE(
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

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  await prisma.albumAccess
    .delete({ where: { albumId_userId: { albumId: params.id, userId } } })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
