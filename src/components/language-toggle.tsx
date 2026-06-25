"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "da" : "en")}
      className="text-xs font-medium px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={lang === "en" ? "Switch to Danish" : "Skift til engelsk"}
    >
      {lang === "en" ? "DA" : "EN"}
    </button>
  );
}
