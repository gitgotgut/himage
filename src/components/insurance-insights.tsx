"use client";

import { AlertTriangle, Lightbulb, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/lib/i18n";

type Policy = {
  type: string;
  provider: string;
  status: string;
};

const RECOMMENDED_TYPES = ["health", "home", "car", "liability"];

export function InsuranceInsights({ policies }: { policies: Policy[] }) {
  const t = useT();
  const active = policies.filter((p) => p.status === "active");

  // Overlap detection: 2+ active policies of the same type
  const byType = active.reduce<Record<string, string[]>>((acc, p) => {
    acc[p.type] = acc[p.type] ?? [];
    acc[p.type].push(p.provider);
    return acc;
  }, {});

  const overlaps = Object.entries(byType).filter(([, providers]) => providers.length >= 2);

  // Gap detection: recommended types with no active policy
  const activeTypes = new Set(active.map((p) => p.type));
  const gaps = RECOMMENDED_TYPES.filter((type) => !activeTypes.has(type));

  if (overlaps.length === 0 && gaps.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          {t("insuranceInsights.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {overlaps.map(([type, providers]) => (
          <div key={type} className="flex gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground">{t("insuranceInsights.overlapWarning", { count: String(providers.length), type: t(`insuranceTypes.${type}`) })}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{t("insuranceInsights.overlapProviders", { list: providers.join(", ") })}</p>
            </div>
          </div>
        ))}
        {gaps.map((type) => (
          <div key={type} className="flex gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary/70 shrink-0 mt-0.5" />
            <p className="text-muted-foreground">{t("insuranceInsights.gapSuggestion", { type: t(`insuranceTypes.${type}`) })}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
