import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { albumCreateSchema } from "@/lib/validations/album";
import { getMyCircleIds, isCircleMember } from "@/lib/circles";

// GET /api/albums — albums the user owns, is shared on, or are shared with a
// circle they belong to.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const myCircleIds = await getMyCircleIds(userId);

  const albums = await prisma.album.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { access: { some: { userId } } },
        { visibility: "OPEN", circleId: { in: myCircleIds } },
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

  // OPEN albums must target a circle the owner belongs to.
  let circleId: string | null = null;
  if (parsed.data.visibility === "OPEN") {
    if (!parsed.data.circleId) {
      return NextResponse.json(
        { error: "Choose a circle to share with" },
        { status: 400 }
      );
    }
    if (!(await isCircleMember(parsed.data.circleId, session.user.id))) {
      return NextResponse.json(
        { error: "You're not a member of that circle" },
        { status: 403 }
      );
    }
    circleId = parsed.data.circleId;
  }

  const album = await prisma.album.create({
    data: {
      ownerId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      visibility: parsed.data.visibility,
      circleId,
    },
  });

  return NextResponse.json(album, { status: 201 });
}
