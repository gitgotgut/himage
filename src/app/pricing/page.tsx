import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getServerT } from "@/lib/server-i18n";

export const metadata = {
  title: "Pricing — Hugo",
  description: "Hugo is completely free. Every feature, no credit card required.",
};

export default async function PricingPage() {
  const t = await getServerT();

  const features = [
    t("pricing.feature1"),
    t("pricing.feature2"),
    t("pricing.feature3"),
    t("pricing.feature4"),
    t("pricing.feature5"),
    t("pricing.feature6"),
    t("pricing.feature7"),
    t("pricing.feature8"),
    t("pricing.feature9"),
    t("pricing.feature10"),
    t("pricing.feature11"),
    t("pricing.feature12"),
    t("pricing.feature13"),
    t("pricing.feature14"),
    t("pricing.feature15"),
    t("pricing.feature16"),
    t("pricing.feature17"),
    t("pricing.feature18"),
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <MarketingHeader />

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
          <p className="inline-block mb-6 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 tracking-wide uppercase">
            {t("pricing.badge")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            {t("pricing.title")}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </section>

        {/* ─── Pricing card ─── */}
        <section className="max-w-lg mx-auto px-6 pb-20">
          <div className="rounded-2xl border-2 border-primary/30 bg-white shadow-sm overflow-hidden">
            <div className="bg-primary px-8 py-6 text-white text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">{t("pricing.freePlanLabel")}</p>
              <p className="text-5xl font-bold mb-1">{t("pricing.price")}</p>
              <p className="text-sm text-white/70">{t("pricing.noCardNeeded")}</p>
            </div>
            <div className="px-8 py-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                {t("pricing.everythingIncluded")}
              </p>
              <ul className="space-y-3">
                {features.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="shrink-0 h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                {t("pricing.getStarted")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Why free ─── */}
        <section className="bg-gray-50 border-y border-gray-100 py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-xl font-bold mb-4">{t("pricing.whyFreeTitle")}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("pricing.whyFreeBody")}
            </p>
          </div>
        </section>

        {/* ─── FAQ teaser ─── */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-500 mb-3">{t("pricing.stillHaveQuestions")}</p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {t("pricing.readFaq")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}
