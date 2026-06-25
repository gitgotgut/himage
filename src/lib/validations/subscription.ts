import { z } from "zod";

const CATEGORIES = [
  "Streaming", "Music", "Gaming", "News & Media",
  "Fitness", "Food", "Software", "Cloud Storage",
  "Education", "VPN & Security", "Productivity", "Shopping", "Other",
] as const;
const BILLING_CYCLES = ["monthly", "annual"] as const;
export const STATUSES = ["active", "paused", "trial"] as const;

const dateOrDatetime = z.string().datetime({ offset: true }).or(z.string().date());

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(CATEGORIES).default("Other"),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number (e.g. 9.99)")
    .transform((v) => Math.round(parseFloat(v) * 100)),
  currency: z.string().length(3).default("USD"),
  billingCycle: z.enum(BILLING_CYCLES),
  renewalDate: dateOrDatetime.optional(),
  status: z.enum(STATUSES).default("active"),
  trialEndDate: dateOrDatetime.nullable().optional(),
  notes: z.string().max(200).nullable().optional(),
  monthlySavingsHint: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Savings hint must be a valid number")
    .transform((v) => Math.round(parseFloat(v) * 100))
    .nullable()
    .optional(),
  householdId: z.string().nullable().optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type CreateSubscriptionInput = z.input<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.input<typeof updateSubscriptionSchema>;
