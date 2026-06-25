import { MarketingHeader } from "@/components/marketing-header";
import { MarketingFooter } from "@/components/marketing-footer";
import { getServerT } from "@/lib/server-i18n";

export const metadata = {
  title: "Terms of Service — Hugo",
  description: "Hugo's Terms of Service. The rules and guidelines for using Hugo.",
};

export default async function TermsPage() {
  const t = await getServerT();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-2xl mx-auto px-6 py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("policies.terms.title")}</h1>
          <p className="text-xs text-gray-400">{t("policies.terms.lastUpdated")}</p>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-16">
          {/* 1. Agreement to Terms */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.agreementTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.agreementBody")}</p>
          </div>

          {/* 2. Account Eligibility */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.eligibilityTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.eligibilityBody")}</p>
          </div>

          {/* 3. Permitted Use */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.useLicenseTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.useLicenseBody")}</p>
          </div>

          {/* 4. Your Data */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.userDataTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.userDataBody")}</p>
          </div>

          {/* 5. Intellectual Property */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.intellectualPropertyTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.intellectualPropertyBody")}</p>
          </div>

          {/* 6. Service Provided As-Is */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.disclaimerTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.disclaimerBody")}</p>
          </div>

          {/* 7. Limitations of Liability */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.liabilityTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.liabilityBody")}</p>
          </div>

          {/* 8. Indemnification */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.indemnificationTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.indemnificationBody")}</p>
          </div>

          {/* 9. Dispute Resolution */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.disputeTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.disputeBody")}</p>
          </div>

          {/* 10. Service Modifications */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.modificationsTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.modificationsBody")}</p>
          </div>

          {/* 11. Termination */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.terminationTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.terminationBody")}</p>
          </div>

          {/* 12. Governing Law */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.governingLawTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.governingLawBody")}</p>
          </div>

          {/* 13. Contact */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{t("policies.terms.contactTitle")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("policies.terms.contactBody")}</p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
