"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ImageOff,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Photo = {
  id: string;
  src: string | null;
  caption: string | null;
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
  const [items, setItems] = useState<Photo[]>(photos);
  const [open, setOpen] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setItems(photos), [photos]);

  const current = open !== null ? items[open] : null;
  const canModify = current
    ? isOwner || current.uploaderId === currentUserId
    : false;

  function close() {
    setOpen(null);
    setEditing(false);
  }
  function step(dir: number) {
    setEditing(false);
    setOpen((o) =>
      o === null ? o : (o + dir + items.length) % items.length
    );
  }

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, items.length]);

  async function saveCaption() {
    if (!current) return;
    setBusy(true);
    const res = await fetch(`/api/albums/${albumId}/photos/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption }),
    });
    setBusy(false);
    if (res.ok) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === current.id ? { ...p, caption: caption || null } : p
        )
      );
      setEditing(false);
      router.refresh();
    }
  }

  async function remove() {
    if (!current) return;
    if (!window.confirm("Remove this photo?")) return;
    setBusy(true);
    const res = await fetch(`/api/albums/${albumId}/photos/${current.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (!res.ok) {
      window.alert("Could not remove the photo.");
      return;
    }
    setItems((prev) => {
      const left = prev.filter((p) => p.id !== current.id);
      if (left.length === 0) setOpen(null);
      else setOpen((o) => Math.min(o ?? 0, left.length - 1));
      return left;
    });
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border py-12 text-center text-muted-foreground">
        <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
        No photos yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setOpen(i);
              setEditing(false);
            }}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            {photo.src ? (
              <Image
                src={photo.src}
                alt={photo.caption ?? `Photo by ${photo.uploaderName}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageOff className="h-7 w-7 text-muted-foreground/50" />
              </div>
            )}
            {photo.caption && (
              <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white truncate text-left">
                {photo.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={close}
        >
          <div
            className="flex items-center justify-end gap-1 p-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {current.src && (
              <a
                href={current.src}
                target="_blank"
                rel="noopener noreferrer"
                download
                aria-label="Download"
                className="p-2 rounded-md hover:bg-white/10"
              >
                <Download className="h-5 w-5" />
              </a>
            )}
            {canModify && (
              <button
                type="button"
                aria-label="Edit caption"
                onClick={() => {
                  setCaption(current.caption ?? "");
                  setEditing((v) => !v);
                }}
                className="p-2 rounded-md hover:bg-white/10"
              >
                <Pencil className="h-5 w-5" />
              </button>
            )}
            {canModify && (
              <button
                type="button"
                aria-label="Delete photo"
                disabled={busy}
                onClick={remove}
                className="p-2 rounded-md hover:bg-white/10 disabled:opacity-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="p-2 rounded-md hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-center relative px-4 sm:px-12 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {items.length > 1 && (
              <button
                type="button"
                aria-label="Previous"
                onClick={() => step(-1)}
                className="absolute left-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {current.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.src}
                alt={current.caption ?? `Photo by ${current.uploaderName}`}
                className="max-h-full max-w-full object-contain"
              />
            )}
            {items.length > 1 && (
              <button
                type="button"
                aria-label="Next"
                onClick={() => step(1)}
                className="absolute right-2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="p-4" onClick={(e) => e.stopPropagation()}>
            {editing ? (
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                  placeholder="Add a caption"
                  className="bg-white"
                />
                <Button onClick={saveCaption} disabled={busy} className="shrink-0">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-center text-sm text-white/80">
                {current.caption}
                {current.caption && <span className="text-white/40"> · </span>}
                <span className="text-white/40">{current.uploaderName}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
