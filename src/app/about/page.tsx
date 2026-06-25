import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Layers } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getServerT } from "@/lib/server-i18n";

export const metadata = {
  title: "About — Hugo",
  description: "Hugo is a simple, private subscription tracker built to give you a clear view of what you're paying for.",
};

export default async function AboutPage() {
  const t = await getServerT();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <MarketingHeader />

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-14">
          <div className="flex items-center gap-2 mb-8">
            <HugoLogo size={24} />
            <span className="font-semibold tracking-tight">Hugo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {t("about.title")}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {t("about.intro")}
          </p>
        </section>

        {/* ─── Story ─── */}
        <section className="max-w-2xl mx-auto px-6 pb-16 space-y-5 text-sm text-gray-600 leading-relaxed">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <p>{t("about.p3")}</p>
        </section>

        {/* ─── Values ─── */}
        <section className="bg-gray-50 border-y border-gray-100 py-16">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-xl font-bold mb-8">{t("about.valuesTitle")}</h2>
            <div className="space-y-6">
              {[
                {
                  icon: <Eye className="h-5 w-5 text-primary" />,
                  title: t("about.value1Title"),
                  body: t("about.value1Body"),
                },
                {
                  icon: <ShieldCheck className="h-5 w-5 text-primary" />,
                  title: t("about.value2Title"),
                  body: t("about.value2Body"),
                },
                {
                  icon: <Layers className="h-5 w-5 text-primary" />,
                  title: t("about.value3Title"),
                  body: t("about.value3Body"),
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="shrink-0 mt-0.5 h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-xl font-bold mb-3">{t("about.ctaTitle")}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {t("about.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                {t("about.getStarted")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("about.readFaq")}
              </Link>
            </div>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}
