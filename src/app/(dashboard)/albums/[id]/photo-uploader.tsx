"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhotoUploader({ albumId }: { albumId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  async function handleFiles(files: FileList) {
    setError("");
    setUploading(true);

    const list = Array.from(files);
    let done = 0;
    for (const file of list) {
      setProgress(`Uploading ${done + 1} of ${list.length}…`);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch(`/api/albums/${albumId}/photos`, {
        method: "POST",
        body,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Couldn't upload ${file.name}`);
        break;
      }
      done += 1;
    }

    setUploading(false);
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-dashed p-6 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        {uploading ? progress || "Uploading…" : "Add photos"}
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        JPG, PNG, WebP or GIF · up to 10 MB each
      </p>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
