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
import { SubscriptionLogo } from "@/components/subscription-logo";
import { useT } from "@/lib/i18n";

export type SubscriptionFormData = {
  name: string; category: string; amount: string; currency: string;
  billingCycle: string; renewalDate: string; status: string;
  trialEndDate: string | null; notes: string | null;
  monthlySavingsHint: string | null; householdId: string | null;
};

export type SubForForm = {
  id: string; name: string; category: string; amountCents: number;
  currency: string; billingCycle: string; renewalDate: string; status: string;
  trialEndDate: string | null; notes: string | null;
  monthlySavingsHintCents: number | null; householdId: string | null;
};

type Props = {
  initial?: SubForForm; householdId?: string | null;
  defaultCurrency?: string;
  onSubmit: (data: SubscriptionFormData) => Promise<void>; onCancel: () => void;
};

const CATEGORIES = [
  "Streaming", "Music", "Gaming", "News & Media",
  "Fitness", "Food", "Software", "Cloud Storage",
  "Education", "VPN & Security", "Productivity", "Shopping", "Other",
];
const BILLING_CYCLES = ["monthly", "annual"] as const;
const STATUSES = ["active", "paused", "trial"] as const;
const CURRENCIES = ["USD","EUR","GBP","SEK","NOK","DKK","CHF","CAD","AUD","JPY"];

export function SubscriptionForm({ initial, householdId, defaultCurrency = "USD", onSubmit, onCancel }: Props) {
  const t = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Other");
  const [amount, setAmount] = useState(initial ? centsToDisplay(initial.amountCents) : "");
  const [currency, setCurrency] = useState(initial?.currency ?? defaultCurrency);
  const [billingCycle, setBillingCycle] = useState(initial?.billingCycle ?? "monthly");
  const [renewalDate, setRenewalDate] = useState(initial ? format(new Date(initial.renewalDate), "yyyy-MM-dd") : "");
  const [status, setStatus] = useState(initial?.status ?? "active");
  const [trialEndDate, setTrialEndDate] = useState(initial?.trialEndDate ? format(new Date(initial.trialEndDate), "yyyy-MM-dd") : "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [annualPrice, setAnnualPrice] = useState("");
  const [shareWithHousehold, setShareWithHousehold] = useState(!!initial?.householdId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const statusLabels: Record<string, string> = {
    active: t("subscriptionForm.statusActive"),
    paused: t("subscriptionForm.statusPaused"),
    trial: t("subscriptionForm.statusTrial"),
  };
  const cycleLabels: Record<string, string> = {
    monthly: t("subscriptionForm.cycleMonthly"),
    annual: t("subscriptionForm.cycleAnnual"),
  };

  const monthlySavingsHint = (() => {
    if (billingCycle !== "monthly" || !annualPrice || !amount) return null;
    const monthly = parseFloat(amount), annual = parseFloat(annualPrice);
    if (isNaN(monthly) || isNaN(annual)) return null;
    const saving = monthly - annual / 12;
    return saving > 0 ? saving.toFixed(2) : null;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError(t("subscriptionForm.nameRequired"));
    if (!/^\d+(\.\d{1,2})?$/.test(amount)) return setError(t("subscriptionForm.invalidAmount"));
    if (status !== "paused" && !renewalDate) return setError(t("subscriptionForm.renewalRequired"));
    if (status === "trial" && !trialEndDate) return setError(t("subscriptionForm.trialDateRequired"));
    setLoading(true);
    try {
      await onSubmit({
        name, category, amount, currency, billingCycle, renewalDate, status,
        trialEndDate: status === "trial" && trialEndDate ? trialEndDate : null,
        notes: notes.trim() || null, monthlySavingsHint,
        householdId: shareWithHousehold && householdId ? householdId : null,
      });
    } catch { setError(t("subscriptionForm.genericError")); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="sub-name">{t("subscriptionForm.nameLabel")}</Label>
        <div className="flex items-center gap-2">
          <SubscriptionLogo name={name} size={32} />
          <Input id="sub-name" placeholder={t("subscriptionForm.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} required className="flex-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("subscriptionForm.categoryLabel")}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{t(`categories.${c}`) !== `categories.${c}` ? t(`categories.${c}`) : c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("subscriptionForm.statusLabel")}</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("subscriptionForm.billingCycleLabel")}</Label>
          <Select value={billingCycle} onValueChange={setBillingCycle}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{BILLING_CYCLES.map((b) => <SelectItem key={b} value={b}>{cycleLabels[b]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub-amount">{t("subscriptionForm.amountLabel")}</Label>
          <div className="flex gap-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 shrink-0"><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input id="sub-amount" placeholder={t("subscriptionForm.amountPlaceholder")} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" required className="flex-1" />
          </div>
        </div>
      </div>

      {billingCycle === "monthly" && (
        <div className="space-y-2">
          <Label htmlFor="sub-annual">{t("subscriptionForm.annualPriceLabel")}</Label>
          <Input id="sub-annual" placeholder={t("subscriptionForm.annualPricePlaceholder")} value={annualPrice} onChange={(e) => setAnnualPrice(e.target.value)} inputMode="decimal" />
          {monthlySavingsHint && <p className="text-xs text-green-600 font-medium">{t("subscriptionForm.annualSavingsHint", { amount: monthlySavingsHint })}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sub-renewal">{t("subscriptionForm.nextRenewalLabel")}</Label>
          <Input id="sub-renewal" type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} required={status !== "paused"} />
        </div>
        {status === "trial" && (
          <div className="space-y-2">
            <Label htmlFor="sub-trial">{t("subscriptionForm.trialEndsLabel")}</Label>
            <Input id="sub-trial" type="date" value={trialEndDate} onChange={(e) => setTrialEndDate(e.target.value)} required />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-notes">{t("subscriptionForm.notesLabel")}</Label>
        <Textarea id="sub-notes" placeholder={t("subscriptionForm.notesPlaceholder")} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={200} rows={2} className="resize-none" />
      </div>

      {householdId && (
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={shareWithHousehold} onChange={(e) => setShareWithHousehold(e.target.checked)} className="rounded border-gray-300" />
          {t("subscriptionForm.shareWithHousehold")}
        </label>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>{t("common.cancel")}</Button>
        <Button type="submit" disabled={loading}>{loading ? t("subscriptionForm.submitting") : initial ? t("subscriptionForm.submitEdit") : t("subscriptionForm.submitAdd")}</Button>
      </div>
    </form>
  );
}
