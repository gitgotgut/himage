import { toMonthlyCents } from "@/lib/utils";

type SubInput = {
  name: string;
  category: string;
  status: string;
  amountCents: number;
  billingCycle: string;
  trialEndDate: Date | null;
  monthlySavingsHintCents: number | null;
};

type PolicyInput = {
  type: string;
  provider: string;
  status: string;
  premiumCents: number;
  billingCycle: string;
};

export type Recommendation = {
  id: string;
  type: "savings" | "warning" | "info";
  titleKey: string;
  descriptionKey: string;
  vars: Record<string, string>;
};

const RECOMMENDED_INSURANCE_TYPES = ["health", "home", "car", "liability"];

const GAP_EXPLANATIONS: Record<string, string> = {
  health: "recommendations.gapExplanationHealth",
  home: "recommendations.gapExplanationHome",
  car: "recommendations.gapExplanationCar",
  liability: "recommendations.gapExplanationLiability",
};

export function generateRecommendations(
  subscriptions: SubInput[],
  policies: PolicyInput[]
): Recommendation[] {
  const results: Recommendation[] = [];
  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trial");
  const activePolicies = policies.filter((p) => p.status === "active");

  // 1. Duplicate subscriptions (case-insensitive name match)
  const seenNames = new Map<string, string>();
  for (const sub of activeSubs) {
    const lower = sub.name.toLowerCase().trim();
    if (seenNames.has(lower)) {
      results.push({
        id: `dup-${lower}`,
        type: "warning",
        titleKey: "recommendations.duplicateTitle",
        descriptionKey: "recommendations.duplicateDesc",
        vars: { name: sub.name },
      });
    } else {
      seenNames.set(lower, sub.name);
    }
  }

  // 2. High-spend category (>40% of total)
  if (activeSubs.length >= 2) {
    const totalMonthly = activeSubs.reduce(
      (sum, s) => sum + toMonthlyCents(s.amountCents, s.billingCycle),
      0
    );
    if (totalMonthly > 0) {
      const byCategory = new Map<string, number>();
      for (const sub of activeSubs) {
        const monthly = toMonthlyCents(sub.amountCents, sub.billingCycle);
        byCategory.set(sub.category, (byCategory.get(sub.category) || 0) + monthly);
      }
      for (const [category, amount] of byCategory) {
        const percent = Math.round((amount / totalMonthly) * 100);
        if (percent > 40) {
          results.push({
            id: `highspend-${category}`,
            type: "info",
            titleKey: "recommendations.highSpendTitle",
            descriptionKey: "recommendations.highSpendDesc",
            vars: { category, percent: String(percent) },
          });
        }
      }
    }
  }

  // 3. Trial expiring within 7 days
  const now = new Date();
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  for (const sub of activeSubs) {
    if (sub.status === "trial" && sub.trialEndDate) {
      const end = new Date(sub.trialEndDate);
      if (end > now && end <= sevenDays) {
        const days = Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        results.push({
          id: `trial-${sub.name}`,
          type: "warning",
          titleKey: "recommendations.trialExpiringTitle",
          descriptionKey: "recommendations.trialExpiringDesc",
          vars: { name: sub.name, days: String(days) },
        });
      }
    }
  }

  // 4. Annual pricing suggestion
  const monthlySubs = activeSubs.filter(
    (s) => s.billingCycle === "monthly" && !s.monthlySavingsHintCents
  );
  if (monthlySubs.length >= 3) {
    results.push({
      id: "annual-savings",
      type: "savings",
      titleKey: "recommendations.annualSavingsTitle",
      descriptionKey: "recommendations.annualSavingsDesc",
      vars: {},
    });
  }

  // 5. Insurance gap detection
  const activeTypes = new Set(activePolicies.map((p) => p.type));
  for (const type of RECOMMENDED_INSURANCE_TYPES) {
    if (!activeTypes.has(type)) {
      results.push({
        id: `gap-${type}`,
        type: "info",
        titleKey: "recommendations.insuranceGapTitle",
        descriptionKey: GAP_EXPLANATIONS[type],
        vars: { type },
      });
    }
  }

  // 6. Insurance overlap detection
  const typeCount = new Map<string, string[]>();
  for (const p of activePolicies) {
    const providers = typeCount.get(p.type) || [];
    providers.push(p.provider);
    typeCount.set(p.type, providers);
  }
  for (const [type, providers] of typeCount) {
    if (providers.length >= 2) {
      results.push({
        id: `overlap-${type}`,
        type: "warning",
        titleKey: "recommendations.insuranceOverlapTitle",
        descriptionKey: "recommendations.insuranceOverlapDesc",
        vars: {
          type,
          count: String(providers.length),
          providers: providers.join(", "),
        },
      });
    }
  }

  return results;
}
