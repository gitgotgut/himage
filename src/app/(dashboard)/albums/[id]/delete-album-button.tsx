"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteAlbumButton({ albumId }: { albumId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm("Delete this album and all its photos? This can't be undone.")
    )
      return;
    setLoading(true);
    const res = await fetch(`/api/albums/${albumId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/hub");
      router.refresh();
    } else {
      setLoading(false);
      window.alert("Could not delete the album.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="gap-2 text-red-600 hover:text-red-700"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting…" : "Delete album"}
    </Button>
  );
}
