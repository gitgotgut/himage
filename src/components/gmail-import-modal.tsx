"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, CheckSquare, Square, AlertCircle, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";

type Candidate = {
  serviceName: string;
  amount: number;
  currency: string;
  billingCycle: "monthly" | "annual";
  renewalDate: string;
  category: string;
  // Price change detection fields (set by server)
  isExisting?: boolean;
  priceChanged?: boolean;
  existingId?: string;
  existingAmountCents?: number;
  newAmountCents?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

type Step = "idle" | "scanning" | "review" | "importing" | "done" | "error";

export function GmailImportModal({ open, onClose, onImported }: Props) {
  const t = useT();
  const [step, setStep] = useState<Step>("idle");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [scanned, setScanned] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  async function runScan() {
    setStep("scanning");
    setErrorMsg("");
    try {
      const res = await fetch("/api/gmail/import", { method: "POST" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Scan failed");
      }
      const data = await res.json();
      const items: Candidate[] = data.candidates ?? [];
      setCandidates(items);
      setScanned(data.scanned ?? 0);
      // Auto-select new subs and price changes; deselect already-tracked same-price
      setSelected(
        new Set(
          items
            .map((c, i) => ({ c, i }))
            .filter(({ c }) => !c.isExisting || c.priceChanged)
            .map(({ i }) => i)
        )
      );
      setStep("review");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
      setStep("error");
    }
  }

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  async function importSelected() {
    setStep("importing");
    const toProcess = candidates.filter((_, i) => selected.has(i));
    await Promise.all(
      toProcess.map((c) => {
        if (c.isExisting && c.priceChanged && c.existingId) {
          // Update existing subscription price (history tracked by PATCH handler)
          return fetch(`/api/subscriptions/${c.existingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: String(c.amount) }),
          });
        }
        if (!c.isExisting) {
          // Create new subscription
          return fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: c.serviceName,
              amount: String(c.amount),
              currency: c.currency,
              billingCycle: c.billingCycle,
              renewalDate: c.renewalDate,
              category: c.category,
              status: "active",
            }),
          });
        }
        return Promise.resolve();
      })
    );
    setStep("done");
    onImported();
  }

  function handleClose() {
    setStep("idle");
    setCandidates([]);
    setSelected(new Set());
    setErrorMsg("");
    onClose();
  }

  const newCount = candidates.filter((c, i) => selected.has(i) && !c.isExisting).length;
  const updateCount = candidates.filter((c, i) => selected.has(i) && c.isExisting && c.priceChanged).length;
  const actionLabel =
    newCount > 0 && updateCount > 0
      ? t(updateCount > 1 ? "importModal.gmail.importAndUpdatePluralPrices" : "importModal.gmail.importAndUpdate", { newCount: String(newCount), updateCount: String(updateCount) })
      : updateCount > 0
        ? t(updateCount > 1 ? "importModal.gmail.updatePricesPlural" : "importModal.gmail.updatePrices", { count: String(updateCount) })
        : t(newCount !== 1 ? "importModal.gmail.importNewPlural" : "importModal.gmail.importNew", { count: String(newCount) });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {t("importModal.gmail.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Idle */}
        {step === "idle" && (
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              {t("importModal.gmail.idleDescription")}
            </p>
            <Button onClick={runScan} className="w-full">
              {t("importModal.gmail.scanButton")}
            </Button>
          </div>
        )}

        {/* Scanning */}
        {step === "scanning" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("importModal.gmail.scanning")}</p>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {errorMsg}
            </div>
            <Button variant="outline" onClick={() => setStep("idle")} className="w-full">
              {t("importModal.gmail.tryAgain")}
            </Button>
          </div>
        )}

        {/* Review */}
        {step === "review" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t(candidates.length !== 1 ? "importModal.gmail.reviewDescriptionPlural" : "importModal.gmail.reviewDescription", { scanned: String(scanned), count: String(candidates.length) })}
            </p>

            {candidates.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">
                {t("importModal.gmail.noReceiptsFound")}
              </p>
            ) : (
              <ul className="divide-y max-h-72 overflow-y-auto">
                {candidates.map((c, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 py-2 cursor-pointer ${c.isExisting && !c.priceChanged ? "opacity-50" : ""}`}
                    onClick={() => toggle(i)}
                  >
                    {selected.has(i) ? (
                      <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{c.serviceName}</p>
                        {c.isExisting && !c.priceChanged && (
                          <Badge variant="outline" className="text-[10px] shrink-0">{t("importModal.gmail.alreadyTracked")}</Badge>
                        )}
                        {c.isExisting && c.priceChanged && (
                          <Badge variant="secondary" className="text-[10px] shrink-0 bg-amber-50 text-amber-700 border-amber-200">{t("importModal.gmail.priceChange")}</Badge>
                        )}
                      </div>
                      {c.isExisting && c.priceChanged && c.existingAmountCents != null ? (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <span className="line-through text-muted-foreground">
                            {c.currency} {(c.existingAmountCents / 100).toFixed(2)}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium">{c.currency} {c.amount.toFixed(2)}</span>
                          <span className={c.newAmountCents! > c.existingAmountCents ? "text-red-600" : "text-green-600"}>
                            ({c.newAmountCents! > c.existingAmountCents ? "+" : ""}
                            {((c.newAmountCents! - c.existingAmountCents) / 100).toFixed(2)})
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {t("importModal.gmail.renewsOn", { date: c.renewalDate })}
                        </p>
                      )}
                    </div>
                    {!(c.isExisting && c.priceChanged) && (
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">
                          {c.currency} {c.amount.toFixed(2)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {c.billingCycle}
                        </Badge>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>
                {t("importModal.gmail.cancel")}
              </Button>
              <Button
                onClick={importSelected}
                disabled={newCount + updateCount === 0}
              >
                {actionLabel}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Importing */}
        {step === "importing" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t("importModal.gmail.importing")}</p>
          </div>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="space-y-3 py-2 text-center">
            <p className="text-sm font-medium text-green-600">
              {newCount > 0 && t(newCount !== 1 ? "importModal.gmail.doneImportedPlural" : "importModal.gmail.doneImported", { count: String(newCount) })}
              {newCount > 0 && updateCount > 0 && ", "}
              {updateCount > 0 && t(updateCount !== 1 ? "importModal.gmail.doneUpdatedPlural" : "importModal.gmail.doneUpdated", { count: String(updateCount) })}
              {newCount === 0 && updateCount === 0 && t("common.done")}
              .
            </p>
            <Button onClick={handleClose} className="w-full">
              {t("common.done")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
