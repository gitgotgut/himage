import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Globe, Lock } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadAlbumForUser } from "@/lib/albums";
import { signedUrls } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { PhotoUploader } from "./photo-uploader";
import { PhotoGrid } from "./photo-grid";
import { SharePanel } from "./share-panel";
import { DeleteAlbumButton } from "./delete-album-button";
import { AlbumEdit } from "./album-edit";

export const dynamic = "force-dynamic";

function personName(p: { displayName: string | null; email: string }) {
  return p.displayName ?? p.email;
}

export default async function AlbumDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  const userId = session.user.id;

  const { album, canView, isOwner, canContribute } = await loadAlbumForUser(
    params.id,
    userId
  );
  if (!album || !canView) notFound();

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
  if (!full) notFound();

  const photoMap = await signedUrls(full.photos.map((p) => p.url));

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/hub"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to albums
      </Link>

      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-2xl font-bold">{full.title}</h1>
        <Badge variant="outline" className="shrink-0 gap-1">
          {full.visibility === "OPEN" ? (
            <>
              <Globe className="h-3 w-3" /> Open
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" /> Invite only
            </>
          )}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-1">
        {isOwner ? "Your album" : `Shared by ${personName(full.owner)}`} ·{" "}
        {full.photos.length} {full.photos.length === 1 ? "photo" : "photos"}
      </p>
      {full.description && (
        <p className="text-sm text-foreground mt-2 mb-2 whitespace-pre-wrap">
          {full.description}
        </p>
      )}

      {canContribute && (
        <div className="my-6">
          <PhotoUploader albumId={full.id} />
        </div>
      )}

      <PhotoGrid
        albumId={full.id}
        currentUserId={userId}
        isOwner={isOwner}
        photos={full.photos.map((p) => ({
          id: p.id,
          src: photoMap[p.url] ?? null,
          caption: p.caption,
          uploaderId: p.uploaderId,
          uploaderName: personName(p.uploader),
        }))}
      />

      {isOwner && (
        <>
          <div className="mt-10">
            <AlbumEdit
              albumId={full.id}
              title={full.title}
              description={full.description ?? ""}
            />
          </div>
          <div className="mt-6">
            <SharePanel
              albumId={full.id}
              members={full.access.map((a) => ({
                userId: a.userId,
                name: personName(a.user),
                email: a.user.email,
              }))}
            />
          </div>
          <div className="mt-8 flex justify-end">
            <DeleteAlbumButton albumId={full.id} />
          </div>
        </>
      )}
    </div>
  );
}
