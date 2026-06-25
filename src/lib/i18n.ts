"use client";

import { useLanguage } from "@/components/language-provider";
import en from "@/messages/en.json";
import da from "@/messages/da.json";

function resolve(obj: unknown, key: string): string {
  const parts = key.split(".");
  let v: unknown = obj;
  for (const p of parts) {
    if (typeof v !== "object" || v === null) return key;
    v = (v as Record<string, unknown>)[p];
  }
  return typeof v === "string" ? v : key;
}

export function useT() {
  const { lang } = useLanguage();
  const messages = lang === "da" ? da : en;
  return (key: string, vars?: Record<string, string | number>): string => {
    let value = resolve(messages, key);
    if (vars) value = value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
    return value;
  };
}
