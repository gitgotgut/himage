import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { albumCreateSchema } from "@/lib/validations/album";

// GET /api/albums — albums the current user owns, has access to, or that are open
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const albums = await prisma.album.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { visibility: "OPEN" },
        { access: { some: { userId } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, displayName: true, email: true } },
      photos: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { photos: true } },
    },
  });

  return NextResponse.json(albums);
}

// POST /api/albums — create an album owned by the current user
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = albumCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const album = await prisma.album.create({
    data: {
      ownerId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      visibility: parsed.data.visibility,
    },
  });

  return NextResponse.json(album, { status: 201 });
}
