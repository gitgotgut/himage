"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type MonthData = { label: string; totalCents: number };

type Props = {
  formatValue?: (s: string) => string;
  categories?: string[];
};

export function SpendingTrendChart({ formatValue = (s: string) => `$${s}`, categories }: Props) {
  const t = useT();
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  const categoriesKey = categories?.length ? categories.slice().sort().join(",") : "";

  useEffect(() => {
    setLoading(true);
    const url = categoriesKey
      ? `/api/spending-history?categories=${encodeURIComponent(categoriesKey)}`
      : "/api/spending-history";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setData(d.months ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoriesKey]);

  if (loading || data.length === 0) return null;

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="40%">
        <CartesianGrid strokeDasharray="4 2" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: string) => v.split(" ")[0]}
        />
        <YAxis
          tickFormatter={(v: number) => formatValue(fmt(v))}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          width={76}
        />
        <Tooltip
          formatter={(value: number) => [formatValue(fmt(value)), t("charts.monthlySpend")]}
          labelFormatter={(label: string) => label}
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
            fontSize: "13px",
            padding: "8px 12px",
          }}
          cursor={{ fill: "#f8fafc" }}
        />
        <Bar dataKey="totalCents" fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
