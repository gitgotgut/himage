"use client";

import { useState, useEffect } from "react";
import { Users, Crown, UserMinus, Trash2, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";

type Member = {
  id: string;
  role: string;
  user: { id: string; email: string };
};

type Household = {
  id: string;
  name: string;
  ownerId: string;
  members: Member[];
};

type Props = {
  userId: string;
  onCreated: (id: string, name: string) => void;
  onLeft: () => void;
};

export function HouseholdPanel({ userId, onCreated, onLeft }: Props) {
  const t = useT();
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/household")
      .then((r) => r.json())
      .then((h) => {
        if (h?.id) setHousehold(h);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isOwner = household?.ownerId === userId;

  async function handleCreate() {
    if (!createName.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/household", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: createName.trim() }),
    });
    if (res.ok) {
      const h = await res.json();
      setHousehold({ ...h, members: [{ id: "self", role: "owner", user: { id: userId, email: "" } }] });
      onCreated(h.id, h.name);
      // Re-fetch to get full member data
      const full = await fetch("/api/household").then((r) => r.json());
      if (full?.id) setHousehold(full);
    } else {
      const data = await res.json();
      setError(data.error || t("household.failedToCreate"));
    }
    setCreating(false);
  }

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteMsg(null);
    setError(null);
    try {
      const res = await fetch("/api/household/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      if (res.ok) {
        setInviteMsg(t("household.inviteSent", { email: inviteEmail.trim() }));
        setInviteEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || t("household.failedToInvite"));
      }
    } catch {
      setError(t("household.networkError"));
    } finally {
      setInviting(false);
    }
  }

  async function handleLeaveOrDelete() {
    setLeaving(true);
    setError(null);
    const res = await fetch("/api/household/leave", { method: "DELETE" });
    if (res.ok) {
      setHousehold(null);
      setConfirmDelete(false);
      onLeft();
    } else {
      setError(t("household.failedToLeave"));
    }
    setLeaving(false);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">{t("household.loading")}</p>;
  }

  // No household — show create form
  if (!household) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("household.noHouseholdDescription")}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder={t("household.householdNamePlaceholder")}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button size="sm" onClick={handleCreate} disabled={creating || !createName.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            {creating ? t("household.creating") : t("household.createButton")}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  // Has household — show members + invite
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" /> {household.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {t(household.members.length !== 1 ? "household.memberCountPlural" : "household.memberCount", { count: String(household.members.length) })}
        </p>
      </div>

      {/* Member list */}
      <div className="space-y-2">
        {household.members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 text-sm rounded-lg border px-3 py-2">
            <span className="flex-1 truncate">{m.user.email}</span>
            <Badge variant={m.role === "owner" ? "default" : "secondary"} className="text-xs">
              {m.role === "owner" ? (
                <><Crown className="h-3 w-3 mr-1" />{t("household.ownerBadge")}</>
              ) : (
                t("household.memberBadge")
              )}
            </Badge>
          </div>
        ))}
      </div>

      {/* Invite form (owner only) */}
      {isOwner && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("household.inviteMember")}</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t("household.inviteEmailPlaceholder")}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <Button size="sm" onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
              <Send className="h-4 w-4 mr-1" />
              {inviting ? t("household.inviting") : t("household.inviteButton")}
            </Button>
          </div>
          {inviteMsg && <p className="text-sm text-green-600">{inviteMsg}</p>}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Leave / Delete */}
      <div className="pt-2 border-t">
        {confirmDelete ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive font-medium">
              {isOwner ? t("household.confirmDeleteOwner") : t("household.confirmDeleteMember")}
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={handleLeaveOrDelete} disabled={leaving}>
                {leaving ? t("common.processing") : isOwner ? t("household.confirmDelete") : t("household.confirmLeave")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
            {isOwner ? (
              <><Trash2 className="h-4 w-4 mr-1" />{t("household.deleteHousehold")}</>
            ) : (
              <><UserMinus className="h-4 w-4 mr-1" />{t("household.leaveHousehold")}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
