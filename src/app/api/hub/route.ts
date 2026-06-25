import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toMonthlyCents } from "@/lib/utils";
import { generateRecommendations } from "@/lib/recommendations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { householdId: true },
  });

  const householdFilter = user?.householdId
    ? [{ householdId: user.householdId }]
    : [];

  const [subscriptions, policies] = await Promise.all([
    prisma.subscription.findMany({
      where: {
        OR: [{ userId: session.user.id }, ...householdFilter],
      },
    }),
    prisma.insurancePolicy.findMany({
      where: {
        OR: [{ userId: session.user.id }, ...householdFilter],
      },
    }),
  ]);

  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trial");
  const activePolicies = policies.filter((p) => p.status === "active");

  const totalMonthlySubscriptionsCents = activeSubs.reduce(
    (sum, s) => sum + toMonthlyCents(s.amountCents, s.billingCycle),
    0
  );
  const totalMonthlyInsuranceCents = activePolicies.reduce(
    (sum, p) => sum + toMonthlyCents(p.premiumCents, p.billingCycle),
    0
  );

  // Upcoming renewals within 30 days
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  type Renewal = {
    type: "subscription" | "insurance";
    name: string;
    renewalDate: string;
    monthlyCents: number;
    currency: string;
  };

  const upcomingRenewals: Renewal[] = [];

  for (const sub of activeSubs) {
    if (sub.renewalDate >= now && sub.renewalDate <= thirtyDays) {
      upcomingRenewals.push({
        type: "subscription",
        name: sub.name,
        renewalDate: sub.renewalDate.toISOString(),
        monthlyCents: toMonthlyCents(sub.amountCents, sub.billingCycle),
        currency: sub.currency,
      });
    }
  }

  for (const policy of activePolicies) {
    if (policy.renewalDate >= now && policy.renewalDate <= thirtyDays) {
      upcomingRenewals.push({
        type: "insurance",
        name: policy.provider,
        renewalDate: policy.renewalDate.toISOString(),
        monthlyCents: toMonthlyCents(policy.premiumCents, policy.billingCycle),
        currency: policy.currency,
      });
    }
  }

  upcomingRenewals.sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  );

  // Recommendations
  const recommendations = generateRecommendations(
    subscriptions.map((s) => ({
      name: s.name,
      category: s.category,
      status: s.status,
      amountCents: s.amountCents,
      billingCycle: s.billingCycle,
      trialEndDate: s.trialEndDate,
      monthlySavingsHintCents: s.monthlySavingsHintCents,
    })),
    policies.map((p) => ({
      type: p.type,
      provider: p.provider,
      status: p.status,
      premiumCents: p.premiumCents,
      billingCycle: p.billingCycle,
    }))
  );

  return NextResponse.json({
    totalMonthlySubscriptionsCents,
    totalMonthlyInsuranceCents,
    subscriptionCount: activeSubs.length,
    policyCount: activePolicies.length,
    upcomingRenewals,
    recommendations,
  });
}
