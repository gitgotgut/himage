import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Images, Plus, ImageOff, Lock, Globe } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signedUrls } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function HubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
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

  const coverMap = await signedUrls(
    albums.map((a) => a.photos[0]?.url).filter((p): p is string => !!p)
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Albums</h1>
          <p className="text-muted-foreground">
            Collect and share the moments worth reliving.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 shrink-0">
          <Link href="/albums/new">
            <Plus className="h-4 w-4" />
            New Album
          </Link>
        </Button>
      </div>

      {albums.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Images className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">No albums yet.</p>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/albums/new">
                <Plus className="h-4 w-4" />
                Start an album
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {albums.map((album) => {
            const cover = album.photos[0];
            const coverSrc = cover ? coverMap[cover.url] : undefined;
            const isOwner = album.ownerId === userId;
            return (
              <Link key={album.id} href={`/albums/${album.id}`} className="group">
                <Card className="overflow-hidden transition-colors hover:border-primary/50">
                  <div className="relative aspect-square bg-muted">
                    {coverSrc ? (
                      <Image
                        src={coverSrc}
                        alt={album.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageOff className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 gap-1"
                    >
                      {album.visibility === "OPEN" ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                    </Badge>
                  </div>
                  <CardContent className="py-3">
                    <p className="font-semibold truncate">{album.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {album._count.photos}{" "}
                      {album._count.photos === 1 ? "photo" : "photos"}
                      {!isOwner &&
                        ` · ${album.owner.displayName ?? album.owner.email}`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
