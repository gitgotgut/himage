import { centsToDisplay } from "@/lib/utils";

type SubRecord = {
  id: string; userId: string; name: string; category: string;
  amountCents: number; currency: string; billingCycle: string;
  renewalDate: Date; createdAt: Date; updatedAt: Date;
  status: string; trialEndDate: Date | null; notes: string | null;
  monthlySavingsHintCents: number | null; householdId: string | null;
};

export function formatSubscription(sub: SubRecord) {
  return {
    ...sub,
    amount: centsToDisplay(sub.amountCents),
    renewalDate: sub.renewalDate.toISOString(),
    trialEndDate: sub.trialEndDate?.toISOString() ?? null,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  };
}
