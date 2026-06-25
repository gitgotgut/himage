"use client";

import { useState, useMemo } from "react";
import { Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import type { BankTranscriptCandidate } from "@/lib/validations/bank-transcript";

interface BankTranscriptModalProps {
  open: boolean;
  fileName: string;
  candidates: BankTranscriptCandidate[];
  onClose: () => void;
  onAdded: () => void;
}

export function BankTranscriptModal({
  open,
  fileName,
  candidates,
  onClose,
  onAdded,
}: BankTranscriptModalProps) {
  const t = useT();
  const [selected, setSelected] = useState<Set<number>>(
    new Set(
      candidates
        .map((_, i) => i)
        .filter((i) => !candidates[i].isExisting)
    )
  );
  const [adding, setAdding] = useState(false);

  const newCandidates = useMemo(
    () => candidates.filter((c) => !c.isExisting),
    [candidates]
  );

  const handleToggle = (index: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  async function handleAdd() {
    if (selected.size === 0) {
      toast.error("Select at least one subscription");
      return;
    }

    setAdding(true);
    try {
      const selectedCandidates = Array.from(selected).map((i) => candidates[i]);

      for (const candidate of selectedCandidates) {
        const res = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: candidate.serviceName,
            category: candidate.category === "Other" ? "Other" : candidate.category,
            amount: candidate.amount.toFixed(2),
            currency: candidate.currency,
            billingCycle: candidate.billingCycle,
            renewalDate: new Date().toISOString(),
            status: "active",
          }),
        });

        if (res.ok) {
          toast.success(`Added ${candidate.serviceName}`);
        } else {
          toast.error(`Failed to add ${candidate.serviceName}`);
        }
      }

      onAdded();
      onClose();
    } catch (error) {
      toast.error("Error adding subscriptions");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Subscriptions found in {fileName}</DialogTitle>
          <DialogDescription>
            {candidates.length} charge{candidates.length !== 1 ? "s" : ""} detected.
            Select which to add to your tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {candidates.map((candidate, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                selected.has(i) && !candidate.isExisting
                  ? "bg-primary/5 border-primary/30"
                  : "hover:bg-muted"
              } ${candidate.isExisting ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!candidate.isExisting) {
                  handleToggle(i);
                }
              }}
            >
              <input
                type="checkbox"
                checked={selected.has(i)}
                onChange={() => handleToggle(i)}
                disabled={candidate.isExisting}
                className="h-4 w-4"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{candidate.serviceName}</p>
                  {candidate.isExisting && (
                    <Badge variant="secondary" className="text-[10px]">
                      Already tracked
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidate.currency} {candidate.amount.toFixed(2)} /{" "}
                  {candidate.billingCycle === "annual" ? "year" : "month"}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {candidate.category}
              </Badge>
            </div>
          ))}
        </div>

        {newCandidates.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            All detected subscriptions are already in your tracking.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selected.size === 0 || adding}
          >
            {adding ? "Adding..." : `Add ${selected.size} subscription${selected.size !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
