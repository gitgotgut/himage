"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Member = { userId: string; name: string; email: string };

export function SharePanel({
  albumId,
  members,
}: {
  albumId: string;
  members: Member[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/albums/${albumId}/access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not share the album.");
      return;
    }
    setEmail("");
    router.refresh();
  }

  async function remove(userId: string) {
    const res = await fetch(`/api/albums/${albumId}/access?userId=${userId}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Shared with</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={add} className="flex gap-2">
          <Input
            type="email"
            placeholder="family@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="gap-2 shrink-0">
            <UserPlus className="h-4 w-4" />
            {loading ? "Sharing…" : "Share"}
          </Button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}

        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Not shared with anyone yet.
          </p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {members.map((m) => (
              <li
                key={m.userId}
                className="flex items-center justify-between gap-2"
              >
                <span className="truncate">{m.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${m.name}`}
                  onClick={() => remove(m.userId)}
                  className="text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
