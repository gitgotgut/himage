import { z } from "zod";

export const INSURANCE_TYPES = [
  "health", "car", "home", "life", "travel", "pet", "contents", "liability", "other",
] as const;
const BILLING_CYCLES = ["monthly", "annual"] as const;
export const INSURANCE_STATUSES = ["active", "cancelled", "expired"] as const;

const dateOrDatetime = z.string().datetime({ offset: true }).or(z.string().date());

export const createInsurancePolicySchema = z.object({
  provider: z.string().min(1, "Provider is required").max(100),
  type: z.enum(INSURANCE_TYPES).default("other"),
  premium: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Premium must be a valid number (e.g. 99.99)")
    .transform((v) => Math.round(parseFloat(v) * 100)),
  currency: z.string().length(3).default("USD"),
  billingCycle: z.enum(BILLING_CYCLES),
  renewalDate: dateOrDatetime.optional(),
  policyNumber: z.string().max(50).nullable().optional(),
  status: z.enum(INSURANCE_STATUSES).default("active"),
  coverageNotes: z.string().max(500).nullable().optional(),
  householdId: z.string().nullable().optional(),
});

export const updateInsurancePolicySchema = createInsurancePolicySchema.partial();

export type CreateInsurancePolicyInput = z.input<typeof createInsurancePolicySchema>;
export type UpdateInsurancePolicyInput = z.input<typeof updateInsurancePolicySchema>;
