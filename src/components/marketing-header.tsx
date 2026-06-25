import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { auth } from "@/auth";
import { FEATURES } from "@/lib/features";
import { getServerT } from "@/lib/server-i18n";
import { LanguageToggle } from "@/components/language-toggle";

export async function MarketingHeader() {
  const session = await auth();
  const t = await getServerT();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <HugoLogo size={28} />
            <span className="font-semibold tracking-tight">Hugo</span>
          </Link>

          {/* Features dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2">
              {t("nav.features")} <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
              <div className="w-[520px] rounded-xl border border-gray-100 bg-white shadow-lg p-4 grid grid-cols-2 gap-1">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <Link
                      key={f.href}
                      href={f.href}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="mt-0.5 shrink-0 h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t(f.nameKey)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t(f.descriptionKey)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2">
            {t("nav.pricing")}
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2">
            {t("nav.about")}
          </Link>
          <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-2">
            {t("common.faq")}
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <LanguageToggle />
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              {t("nav.dashboard")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                {t("nav.getStarted")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
