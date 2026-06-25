import Link from "next/link";
import {
  ArrowRight,
  Mail,
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
  title: "Gmail Integration — Hugo",
  description:
    "Learn how Hugo uses your Gmail to detect subscriptions, what data we access, and what we never store.",
};

export default async function GmailPage() {
  const t = await getServerT();

  const steps = [
    { icon: <KeyRound className="h-5 w-5 text-primary" />, step: "1", title: t("gmail.step1Title"), body: t("gmail.step1Body") },
    { icon: <Eye className="h-5 w-5 text-primary" />, step: "2", title: t("gmail.step2Title"), body: t("gmail.step2Body") },
    { icon: <Sparkles className="h-5 w-5 text-primary" />, step: "3", title: t("gmail.step3Title"), body: t("gmail.step3Body") },
    { icon: <Check className="h-5 w-5 text-primary" />, step: "4", title: t("gmail.step4Title"), body: t("gmail.step4Body") },
    { icon: <Ban className="h-5 w-5 text-primary" />, step: "5", title: t("gmail.step5Title"), body: t("gmail.step5Body") },
  ];

  const rows = [
    { data: t("gmail.row1Data"), stored: t("gmail.row1Stored"), yes: true, why: t("gmail.row1Why") },
    { data: t("gmail.row2Data"), stored: t("gmail.row2Stored"), yes: false, why: t("gmail.row2Why") },
    { data: t("gmail.row3Data"), stored: t("gmail.row3Stored"), yes: false, why: t("gmail.row3Why") },
    { data: t("gmail.row4Data"), stored: t("gmail.row4Stored"), yes: false, why: t("gmail.row4Why") },
    { data: t("gmail.row5Data"), stored: t("gmail.row5Stored"), yes: true, why: t("gmail.row5Why") },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">

      <MarketingHeader />

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Mail className="h-3.5 w-3.5" /> {t("gmail.badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            {t("gmail.title")}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            {t("gmail.subtitle")}
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
                    {t("gmail.step", { n: item.step })}
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
            <h2 className="text-xl font-bold mb-2">{t("gmail.dataTableTitle")}</h2>
            <p className="text-sm text-gray-500 mb-8">
              {t("gmail.dataTableSubtitle")}
            </p>
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 font-medium text-gray-600">{t("gmail.colData")}</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-600">{t("gmail.colStored")}</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-600">{t("gmail.colWhy")}</th>
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
                <h3 className="font-semibold text-gray-900 mb-2">{t("gmail.privacyTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t("gmail.privacyBody")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-xl font-bold mb-3">{t("gmail.ctaTitle")}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {t("gmail.ctaSubtitle")}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t("gmail.ctaButton")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <MarketingFooter />

    </div>
  );
}
