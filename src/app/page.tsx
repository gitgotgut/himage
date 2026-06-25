import Link from "next/link";
import { DashboardPreview } from "@/components/dashboard-preview";
import {
  ArrowRight,
  Check,
  Mail,
  ShieldCheck,
  Sparkles,
  Shield,
  Bell,
  BarChart3,
  AlertCircle,
  LinkIcon,
  FileText,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getServerT } from "@/lib/server-i18n";

export default async function Home() {
  const t = await getServerT();

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">

      <MarketingHeader />

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <p className="inline-block mb-6 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary tracking-wide uppercase">
            {t("landing.badge")}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-foreground">
            {t("landing.heroTitle")}
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
            {t("landing.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t("landing.startTracking")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              {t("landing.signIn")}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            <Check className="inline h-3.5 w-3.5 mr-1" />
            {t("landing.noCreditCard")}
            <span className="mx-2">·</span>
            <Check className="inline h-3.5 w-3.5 mr-1" />
            {t("landing.deleteAnytime")}
          </p>
        </section>

        {/* ─── Dashboard preview (animated) ─── */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <DashboardPreview />
        </section>

        {/* ─── Trust logos ─── */}
        <section className="border-y border-border py-8">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs text-muted-foreground text-center mb-4">{t("landing.trustLine")}</p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted-foreground/60">
              <span>Tryg</span>
              <span>Alka</span>
              <span>Topdanmark</span>
              <span>Gjensidige</span>
              <span>Codan</span>
            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-2">
              {t("landing.howItWorksTitle")}
            </h2>
            <p className="text-muted-foreground text-sm mb-14">
              {t("landing.howItWorksSubtitle")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "01", title: t("landing.step1Title"), description: t("landing.step1Desc") },
                { step: "02", title: t("landing.step2Title"), description: t("landing.step2Desc") },
                { step: "03", title: t("landing.step3Title"), description: t("landing.step3Desc") },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center">
                  <span className="mb-4 text-4xl font-bold text-primary/15 select-none font-display">
                    {s.step}
                  </span>
                  <h3 className="font-semibold mb-2 text-sm">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features bento grid ─── */}
        <section className="bg-muted border-y border-border py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight mb-2 text-center">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-muted-foreground text-center mb-12 text-sm">
              {t("landing.featuresSubtitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: <Mail className="h-5 w-5 text-primary" />,
                  title: t("landing.featureSmartImportTitle"),
                  description: t("landing.featureSmartImportDesc"),
                },
                {
                  icon: <Shield className="h-5 w-5 text-accent" />,
                  title: t("landing.featureInsuranceTitle"),
                  description: t("landing.featureInsuranceDesc"),
                },
                {
                  icon: <Bell className="h-5 w-5 text-primary" />,
                  title: t("landing.featureRenewalTitle"),
                  description: t("landing.featureRenewalDesc"),
                },
                {
                  icon: <BarChart3 className="h-5 w-5 text-accent" />,
                  title: t("landing.featureAnalyticsTitle"),
                  description: t("landing.featureAnalyticsDesc"),
                },
                {
                  icon: <AlertCircle className="h-5 w-5 text-primary" />,
                  title: t("landing.featureClaimsTitle"),
                  description: t("landing.featureClaimsDesc"),
                },
                {
                  icon: <FileText className="h-5 w-5 text-accent" />,
                  title: t("landing.featureProposalsTitle"),
                  description: t("landing.featureProposalsDesc"),
                },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-white p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Email import ─── */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                <Sparkles className="h-3.5 w-3.5" /> {t("landing.emailImportBadge")}
              </div>
              <h2 className="font-display text-3xl font-semibold tracking-tight mb-3">
                {t("landing.emailImportTitle")}
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
                {t("landing.emailImportSubtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gmail card */}
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-white border border-primary/20 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("landing.gmailTitle")}</p>
                    <p className="text-xs text-muted-foreground">{t("landing.gmailSubtitle")}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {t("landing.gmailDesc")}
                </p>
                <Link
                  href="/gmail"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t("landing.gmailLink")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Outlook card */}
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-white border border-primary/20 flex items-center justify-center shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="3" width="13" height="18" rx="2" fill="#0078D4"/>
                      <rect x="9" y="7" width="13" height="10" rx="1.5" fill="#28A8E8"/>
                      <path d="M9 7L15.5 12L22 7" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t("landing.outlookTitle")}</p>
                    <p className="text-xs text-muted-foreground">{t("landing.outlookSubtitle")}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {t("landing.outlookDesc")}
                </p>
                <Link
                  href="/outlook"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t("landing.outlookLink")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Shared privacy note */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { icon: <Mail className="h-3.5 w-3.5" />, text: t("landing.privacyReadOnly") },
                { icon: <Sparkles className="h-3.5 w-3.5" />, text: t("landing.privacyAI") },
                { icon: <ShieldCheck className="h-3.5 w-3.5" />, text: t("landing.privacyNoStore") },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5">
                  {item.icon} {item.text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="py-16 border-y border-border">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-4xl font-semibold text-primary">2,847</p>
              <p className="text-sm text-muted-foreground mt-1">{t("landing.statsSubscriptions")}</p>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold text-accent">430.000 kr</p>
              <p className="text-sm text-muted-foreground mt-1">{t("landing.statsSaved")}</p>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold text-primary">98%</p>
              <p className="text-sm text-muted-foreground mt-1">{t("landing.statsSatisfaction")}</p>
            </div>
          </div>
        </section>

        {/* ─── Brand story CTA ─── */}
        <section className="py-20 bg-[#141C2E]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4">
              {t("landing.ctaStoryTitle")}
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {t("landing.ctaStorySubtitle")}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors shadow-sm"
            >
              {t("landing.ctaButton")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <MarketingFooter />

    </div>
  );
}
