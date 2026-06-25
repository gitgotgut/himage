"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toMonthlyCents, centsToDisplay } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Policy = {
  type: string;
  premiumCents: number;
  billingCycle: string;
  status: string;
};

const TYPE_COLORS: Record<string, string> = {
  health: "#16a34a", car: "#d97706", home: "#2563eb", life: "#7c3aed",
  travel: "#0891b2", pet: "#ea580c", contents: "#db2777", liability: "#dc2626",
  other: "#475569",
};

export function InsuranceChart({ policies, formatValue = (s: string) => `$${s}` }: { policies: Policy[]; formatValue?: (s: string) => string }) {
  const t = useT();
  const active = policies.filter((p) => p.status === "active");
  if (active.length === 0) return null;

  const byType = active.reduce<Record<string, number>>((acc, p) => {
    const monthly = toMonthlyCents(p.premiumCents, p.billingCycle);
    acc[p.type] = (acc[p.type] ?? 0) + monthly;
    return acc;
  }, {});

  const data = Object.entries(byType)
    .map(([name, cents]) => ({ name, value: cents, display: `${formatValue(centsToDisplay(cents))}${t("charts.perMo")}` }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-5">
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
                <Cell key={entry.name} fill={TYPE_COLORS[entry.name] ?? "#475569"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_value: any, _name: any, props: any) => [props.payload.display, t(`insuranceTypes.${props.payload.name}`)]}
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center leading-none">
            <p className="text-xl font-bold tracking-tight">{formatValue(centsToDisplay(total))}</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{t("charts.perMonth")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: TYPE_COLORS[entry.name] ?? "#475569" }}
              />
              <span className="truncate text-muted-foreground">{t(`insuranceTypes.${entry.name}`)}</span>
            </div>
            <span className="font-semibold text-foreground shrink-0 tabular-nums">{entry.display}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
