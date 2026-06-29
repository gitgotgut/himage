"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ImageOff } from "lucide-react";

type Photo = {
  id: string;
  url: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  uploaderId: string;
  uploaderName: string;
};

export function PhotoGrid({
  albumId,
  photos,
  currentUserId,
  isOwner,
}: {
  albumId: string;
  photos: Photo[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(photoId: string) {
    if (!window.confirm("Remove this photo?")) return;
    setDeleting(photoId);
    const res = await fetch(`/api/albums/${albumId}/photos/${photoId}`, {
      method: "DELETE",
    });
    setDeleting(null);
    if (res.ok) router.refresh();
    else window.alert("Could not remove the photo.");
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border py-12 text-center text-muted-foreground">
        <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No photos yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {photos.map((photo) => {
        const canDelete = isOwner || photo.uploaderId === currentUserId;
        return (
          <div
            key={photo.id}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? `Photo by ${photo.uploaderName}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
            {canDelete && (
              <button
                type="button"
                aria-label="Delete photo"
                disabled={deleting === photo.id}
                onClick={() => remove(photo.id)}
                className="absolute top-2 right-2 rounded-md bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {photo.caption && (
              <p className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white truncate">
                {photo.caption}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
