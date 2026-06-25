import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { getServerT } from "@/lib/server-i18n";
import { HugoLogo } from "@/components/hugo-logo";

export async function MarketingFooter() {
  const t = await getServerT();
  return (
    <footer className="bg-[#141C2E] text-gray-400">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <HugoLogo size={20} />
              <span className="font-semibold text-sm tracking-tight text-white">Hugo</span>
            </Link>
            <p className="text-xs text-gray-500 max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 text-xs">
            <div>
              <p className="font-medium text-gray-300 mb-2">{t("footer.product")}</p>
              <ul className="space-y-1.5">
                <li><Link href="/register" className="hover:text-white transition-colors">{t("footer.getStarted")}</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">{t("footer.signIn")}</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-300 mb-2">{t("footer.company")}</p>
              <ul className="space-y-1.5">
                <li><Link href="/about" className="hover:text-white transition-colors">{t("footer.about")}</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">{t("footer.faq")}</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-300 mb-2">{t("footer.featuresHeading")}</p>
              <ul className="space-y-1.5">
                {FEATURES.map((f) => (
                  <li key={f.href}>
                    <Link href={f.href} className="hover:text-white transition-colors">{t(f.nameKey)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-300 mb-2">{t("footer.legal")}</p>
              <ul className="space-y-1.5">
                <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacyPolicy")}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer.termsOfService")}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
