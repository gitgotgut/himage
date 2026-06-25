import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Eye,
  Ban,
  Check,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getServerT } from "@/lib/server-i18n";

export const metadata = {
  title: "Outlook Integration — Hugo",
  description:
    "Learn how Hugo uses your Outlook to detect subscriptions, what data we access, and what we never store.",
};

export default async function OutlookPage() {
  const t = await getServerT();

  const steps = [
    { icon: <KeyRound className="h-5 w-5 text-primary" />, step: "1", title: t("outlook.step1Title"), body: t("outlook.step1Body") },
    { icon: <Eye className="h-5 w-5 text-primary" />, step: "2", title: t("outlook.step2Title"), body: t("outlook.step2Body") },
    { icon: <Sparkles className="h-5 w-5 text-primary" />, step: "3", title: t("outlook.step3Title"), body: t("outlook.step3Body") },
    { icon: <Check className="h-5 w-5 text-primary" />, step: "4", title: t("outlook.step4Title"), body: t("outlook.step4Body") },
    { icon: <Ban className="h-5 w-5 text-primary" />, step: "5", title: t("outlook.step5Title"), body: t("outlook.step5Body") },
  ];

  const rows = [
    { data: t("outlook.row1Data"), stored: t("outlook.row1Stored"), yes: true, why: t("outlook.row1Why") },
    { data: t("outlook.row2Data"), stored: t("outlook.row2Stored"), yes: false, why: t("outlook.row2Why") },
    { data: t("outlook.row3Data"), stored: t("outlook.row3Stored"), yes: false, why: t("outlook.row3Why") },
    { data: t("outlook.row4Data"), stored: t("outlook.row4Stored"), yes: false, why: t("outlook.row4Why") },
    { data: t("outlook.row5Data"), stored: t("outlook.row5Stored"), yes: true, why: t("outlook.row5Why") },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">

      <MarketingHeader />

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="13" height="18" rx="2" fill="#0078D4"/>
              <rect x="9" y="7" width="13" height="10" rx="1.5" fill="#28A8E8"/>
              <path d="M9 7L15.5 12L22 7" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {t("outlook.badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            {t("outlook.title")}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {t("outlook.subtitle")}
          </p>
        </section>

        {/* ─── Step by step ─── */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <div className="space-y-4">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-5 rounded-xl border border-gray-100 bg-gray-50 p-6">
                <div className="shrink-0 mt-0.5">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                    {t("outlook.step", { n: item.step })}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Data table ─── */}
        <section className="bg-gray-50 border-y border-gray-100 py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl font-bold mb-2">{t("outlook.dataTableTitle")}</h2>
            <p className="text-sm text-gray-500 mb-8">
              {t("outlook.dataTableSubtitle")}
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 font-medium text-gray-600">{t("outlook.colData")}</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-600">{t("outlook.colStored")}</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-600">{t("outlook.colWhy")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => (
                    <tr key={row.data}>
                      <td className="px-5 py-3 text-gray-800">{row.data}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${row.yes ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                          {row.stored}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── Privacy callout ─── */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8 flex gap-5 items-start">
              <ShieldCheck className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t("outlook.privacyTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t("outlook.privacyBody")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-xl font-bold mb-3">{t("outlook.ctaTitle")}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {t("outlook.ctaSubtitle")}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t("outlook.ctaButton")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <MarketingFooter />

    </div>
  );
}
