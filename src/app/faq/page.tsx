import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { FaqAccordion } from "@/components/faq-accordion";
import { getServerT } from "@/lib/server-i18n";

export const metadata = {
  title: "FAQ — Hugo",
  description: "Frequently asked questions about Hugo — the free subscription and insurance tracker.",
};

export default async function FAQPage() {
  const t = await getServerT();

  const FAQS = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
    { q: t("faq.q10"), a: t("faq.a10") },
    { q: t("faq.q11"), a: t("faq.a11") },
    { q: t("faq.q12"), a: t("faq.a12") },
    { q: t("faq.q13"), a: t("faq.a13") },
    { q: t("faq.q14"), a: t("faq.a14") },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <MarketingHeader />

      <main className="flex-1">

        {/* Hero */}
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-14">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </section>

        {/* Accordion */}
        <section className="max-w-2xl mx-auto px-6 pb-20">
          <FaqAccordion items={FAQS} />
        </section>

        {/* CTA */}
        <section className="bg-gray-50 border-t border-gray-100 py-16">
          <div className="max-w-2xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-semibold text-gray-900 mb-1">{t("faq.stillHaveQuestion")}</p>
              <p className="text-sm text-gray-500">{t("faq.happyToHelp")}</p>
            </div>
            <Link
              href="/register"
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t("faq.getStartedFree")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}
