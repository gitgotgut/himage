"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toMonthlyCents, centsToDisplay } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Subscription = {
  category: string;
  amountCents: number;
  billingCycle: string;
};

const COLORS: Record<string, string> = {
  Streaming:        "#7c3aed",
  Music:            "#db2777",
  Gaming:           "#d97706",
  "News & Media":   "#0284c7",
  Fitness:          "#16a34a",
  Food:             "#ea580c",
  Software:         "#2563eb",
  "Cloud Storage":  "#0891b2",
  Education:        "#4f46e5",
  "VPN & Security": "#dc2626",
  Productivity:     "#65a30d",
  Shopping:         "#c026d3",
  Other:            "#475569",
};

export function SpendingChart({ subscriptions, formatValue = (s: string) => `$${s}` }: { subscriptions: Subscription[]; formatValue?: (s: string) => string }) {
  const t = useT();
  if (subscriptions.length === 0) return null;

  const byCategory = subscriptions.reduce<Record<string, number>>((acc, sub) => {
    const monthly = toMonthlyCents(sub.amountCents, sub.billingCycle);
    acc[sub.category] = (acc[sub.category] ?? 0) + monthly;
    return acc;
  }, {});

  const data = Object.entries(byCategory)
    .map(([name, cents]) => ({ name, value: cents, display: `${formatValue(centsToDisplay(cents))}${t("charts.perMo")}` }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-5">
      {/* Donut chart with center total */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={196}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] ?? "#475569"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_value, _name, props) => [props.payload.display, props.payload.name]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
                fontSize: "13px",
                padding: "8px 12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center leading-none">
            <p className="text-xl font-bold tracking-tight">{formatValue(centsToDisplay(total))}</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{t("charts.perMonth")}</p>
          </div>
        </div>
      </div>

      {/* Custom legend */}
      <div className="space-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[entry.name] ?? "#475569" }}
              />
              <span className="truncate text-muted-foreground">{t(`categories.${entry.name}`) !== `categories.${entry.name}` ? t(`categories.${entry.name}`) : entry.name}</span>
            </div>
            <span className="font-semibold text-foreground shrink-0 tabular-nums">{entry.display}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
