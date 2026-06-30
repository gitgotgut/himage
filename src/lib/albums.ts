import { prisma } from "@/lib/prisma";
import { getMyCircleIds } from "@/lib/circles";

// Load an album plus the current user's relationship to it (owner / can view).
export async function loadAlbumForUser(albumId: string, userId: string) {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: { access: { select: { userId: true } } },
  });

  if (!album) {
    return { album: null, isOwner: false, canView: false, canContribute: false };
  }

  const isOwner = album.ownerId === userId;
  const isMember = album.access.some((a) => a.userId === userId);
  // OPEN albums are visible to members of the circle they're shared with.
  const myCircleIds = await getMyCircleIds(userId);
  const inCircle =
    album.visibility === "OPEN" &&
    !!album.circleId &&
    myCircleIds.includes(album.circleId);

  const canView = isOwner || isMember || inCircle;
  // Owner and explicitly-shared members may add photos; circle viewers of an
  // OPEN album can view but not contribute.
  const canContribute = isOwner || isMember;

  return { album, isOwner, canView, canContribute };
}
