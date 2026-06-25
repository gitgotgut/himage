"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { centsToDisplay } from "@/lib/utils";
import { format } from "date-fns";
import { useT } from "@/lib/i18n";

export type InsuranceFormData = {
  provider: string; type: string; premium: string; currency: string;
  billingCycle: string; renewalDate: string; policyNumber: string | null;
  status: string; coverageNotes: string | null; householdId: string | null;
};

export type PolicyForForm = {
  id: string; provider: string; type: string; premiumCents: number;
  currency: string; billingCycle: string; renewalDate: string;
  policyNumber: string | null; status: string; coverageNotes: string | null;
  householdId: string | null;
};

type Props = {
  initial?: PolicyForForm; householdId?: string | null;
  defaultCurrency?: string;
  onSubmit: (data: InsuranceFormData) => Promise<void>; onCancel: () => void;
};

const INSURANCE_TYPES = [
  "health", "car", "home", "life", "travel", "pet", "contents", "liability", "other",
];
const BILLING_CYCLES = ["monthly", "annual"] as const;
const STATUSES = ["active", "cancelled", "expired"] as const;
const CURRENCIES = ["USD","EUR","GBP","SEK","NOK","DKK","CHF","CAD","AUD","JPY"];

export function InsuranceForm({ initial, householdId, defaultCurrency = "USD", onSubmit, onCancel }: Props) {
  const t = useT();
  const [provider, setProvider] = useState(initial?.provider ?? "");
  const [type, setType] = useState(initial?.type ?? "other");
  const [premium, setPremium] = useState(initial ? centsToDisplay(initial.premiumCents) : "");
  const [currency, setCurrency] = useState(initial?.currency ?? defaultCurrency);
  const [billingCycle, setBillingCycle] = useState(initial?.billingCycle ?? "monthly");
  const [renewalDate, setRenewalDate] = useState(initial ? format(new Date(initial.renewalDate), "yyyy-MM-dd") : "");
  const [policyNumber, setPolicyNumber] = useState(initial?.policyNumber ?? "");
  const [status, setStatus] = useState(initial?.status ?? "active");
  const [coverageNotes, setCoverageNotes] = useState(initial?.coverageNotes ?? "");
  const [shareWithHousehold, setShareWithHousehold] = useState(!!initial?.householdId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const statusLabels: Record<string, string> = {
    active: t("insuranceForm.statusActive"),
    cancelled: t("insuranceForm.statusCancelled"),
    expired: t("insuranceForm.statusExpired"),
  };
  const cycleLabels: Record<string, string> = {
    monthly: t("insuranceForm.cycleMonthly"),
    annual: t("insuranceForm.cycleAnnual"),
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!provider.trim()) return setError(t("insuranceForm.providerRequired"));
    if (!/^\d+(\.\d{1,2})?$/.test(premium)) return setError(t("insuranceForm.invalidPremium"));
    if (!renewalDate) return setError(t("insuranceForm.renewalRequired"));
    setLoading(true);
    try {
      await onSubmit({
        provider, type, premium, currency, billingCycle, renewalDate,
        policyNumber: policyNumber.trim() || null, status,
        coverageNotes: coverageNotes.trim() || null,
        householdId: shareWithHousehold && householdId ? householdId : null,
      });
    } catch { setError(t("insuranceForm.genericError")); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="ins-provider">{t("insuranceForm.providerLabel")}</Label>
        <Input id="ins-provider" placeholder={t("insuranceForm.providerPlaceholder")} value={provider} onChange={(e) => setProvider(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("insuranceForm.typeLabel")}</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{INSURANCE_TYPES.map((t2) => <SelectItem key={t2} value={t2}>{t(`insuranceTypes.${t2}`)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("insuranceForm.statusLabel")}</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("insuranceForm.billingCycleLabel")}</Label>
          <Select value={billingCycle} onValueChange={setBillingCycle}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{BILLING_CYCLES.map((b) => <SelectItem key={b} value={b}>{cycleLabels[b]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ins-premium">{t("insuranceForm.premiumLabel")}</Label>
          <div className="flex gap-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 shrink-0"><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input id="ins-premium" placeholder={t("insuranceForm.premiumPlaceholder")} value={premium} onChange={(e) => setPremium(e.target.value)} inputMode="decimal" required className="flex-1" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ins-renewal">{t("insuranceForm.nextRenewalLabel")}</Label>
          <Input id="ins-renewal" type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ins-policy-num">{t("insuranceForm.policyNumberLabel")}</Label>
          <Input id="ins-policy-num" placeholder={t("insuranceForm.policyNumberPlaceholder")} value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ins-notes">{t("insuranceForm.coverageNotesLabel")}</Label>
        <Textarea id="ins-notes" placeholder={t("insuranceForm.coverageNotesPlaceholder")} value={coverageNotes} onChange={(e) => setCoverageNotes(e.target.value)} maxLength={500} rows={2} className="resize-none" />
      </div>

      {householdId && (
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={shareWithHousehold} onChange={(e) => setShareWithHousehold(e.target.checked)} className="rounded border-gray-300" />
          {t("insuranceForm.shareWithHousehold")}
        </label>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>{t("common.cancel")}</Button>
        <Button type="submit" disabled={loading}>{loading ? t("insuranceForm.submitting") : initial ? t("insuranceForm.submitEdit") : t("insuranceForm.submitAdd")}</Button>
      </div>
    </form>
  );
}
