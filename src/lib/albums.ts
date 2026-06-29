import { prisma } from "@/lib/prisma";

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
  const canView = isOwner || album.visibility === "OPEN" || isMember;
  // Owner and explicitly-shared members may add photos; passers-by on an OPEN
  // album can view but not contribute.
  const canContribute = isOwner || isMember;

  return { album, isOwner, canView, canContribute };
}
