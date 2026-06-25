"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useT } from "@/lib/i18n";

export function SpendChangeBadge() {
  const t = useT();
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/spending-history")
      .then((r) => r.json())
      .then((d) => {
        const months = d.months ?? [];
        if (months.length >= 2) {
          const current = months[months.length - 1].totalCents;
          const previous = months[months.length - 2].totalCents;
          if (previous > 0) {
            setChange(Math.round(((current - previous) / previous) * 100));
          }
        }
      })
      .catch(() => {});
  }, []);

  if (change === null) return null;

  const isUp = change > 0;
  const isDown = change < 0;
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const color = isUp ? "text-red-600" : isDown ? "text-green-600" : "text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      {isUp ? "+" : ""}{change}{t("charts.spendFromLastMonth")}
    </span>
  );
}
