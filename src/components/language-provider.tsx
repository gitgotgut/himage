"use client";

import { createContext, useContext, useState } from "react";

type Lang = "en" | "da";

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload(); // re-renders server components with new cookie
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
