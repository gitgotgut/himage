import { cookies } from "next/headers";
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

export async function getServerT() {
  const store = await cookies();
  const lang = store.get("lang")?.value === "da" ? "da" : "en";
  const messages = lang === "da" ? da : en;
  return (key: string, vars?: Record<string, string | number>): string => {
    let value = resolve(messages, key);
    if (vars) value = value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
    return value;
  };
}

export async function getServerLang(): Promise<"en" | "da"> {
  const store = await cookies();
  return store.get("lang")?.value === "da" ? "da" : "en";
}
