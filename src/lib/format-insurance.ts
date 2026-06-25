import { centsToDisplay } from "@/lib/utils";

type PolicyRecord = {
  id: string; userId: string; provider: string; type: string;
  premiumCents: number; currency: string; billingCycle: string;
  renewalDate: Date; createdAt: Date; updatedAt: Date;
  status: string; policyNumber: string | null; coverageNotes: string | null;
  householdId: string | null;
};

export function formatInsurancePolicy(policy: PolicyRecord) {
  return {
    ...policy,
    premium: centsToDisplay(policy.premiumCents),
    renewalDate: policy.renewalDate.toISOString(),
    createdAt: policy.createdAt.toISOString(),
    updatedAt: policy.updatedAt.toISOString(),
  };
}
