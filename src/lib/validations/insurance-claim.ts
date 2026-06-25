import { z } from "zod";

const dateOrDatetime = z.string().datetime({ offset: true }).or(z.string().date());

export const CLAIM_STATUSES = ["open", "submitted", "approved", "denied", "closed"] as const;

export const createClaimSchema = z.object({
  policyId: z.string().min(1, "Policy is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).nullable().optional(),
  claimDate: dateOrDatetime,
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number")
    .transform((v) => Math.round(parseFloat(v) * 100))
    .nullable()
    .optional(),
  status: z.enum(CLAIM_STATUSES).default("open"),
  referenceNumber: z.string().max(100).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const updateClaimSchema = createClaimSchema.partial();

export type CreateClaimInput = z.input<typeof createClaimSchema>;
export type UpdateClaimInput = z.input<typeof updateClaimSchema>;
