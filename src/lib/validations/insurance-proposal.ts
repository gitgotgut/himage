import { z } from "zod";

const dateOrDatetime = z.string().datetime({ offset: true }).or(z.string().date());

export const PROPOSAL_STATUSES = ["pending", "accepted", "rejected", "expired"] as const;

export const INSURANCE_TYPES = [
  "health", "car", "home", "life", "travel", "pet", "contents", "liability", "other",
] as const;

export const createProposalSchema = z.object({
  provider: z.string().min(1, "Provider is required").max(200),
  type: z.enum(INSURANCE_TYPES).default("other"),
  quotedPremium: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Premium must be a valid number")
    .transform((v) => Math.round(parseFloat(v) * 100)),
  currency: z.string().length(3).default("USD"),
  billingCycle: z.enum(["monthly", "annual"]),
  validUntil: dateOrDatetime.nullable().optional(),
  status: z.enum(PROPOSAL_STATUSES).default("pending"),
  notes: z.string().max(2000).nullable().optional(),
});

export const updateProposalSchema = createProposalSchema.partial();

export type CreateProposalInput = z.input<typeof createProposalSchema>;
export type UpdateProposalInput = z.input<typeof updateProposalSchema>;
