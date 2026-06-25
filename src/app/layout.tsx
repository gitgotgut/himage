import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { NextAuthSessionProvider } from "@/components/session-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Hugo",
  description: "Track your subscriptions and insurance in one place.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const lang = store.get("lang")?.value === "da" ? "da" : "en";

  return (
    <html lang={lang}>
      <body className={`${plusJakarta.variable} ${fraunces.variable} ${plusJakarta.className}`}>
        <NextAuthSessionProvider>
          <LanguageProvider initialLang={lang}>
            {children}
            <Toaster />
          </LanguageProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
