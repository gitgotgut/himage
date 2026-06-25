import { z } from "zod";

export const createBankTranscriptCandidateSchema = z.object({
  serviceName: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3),
  billingCycle: z.enum(["monthly", "annual"]),
  category: z.enum(["Streaming", "Music", "Software", "Fitness", "Food", "Gaming", "News", "Cloud", "Other"]),
  isExisting: z.boolean().optional().default(false),
  existingId: z.string().optional(),
});

export type BankTranscriptCandidate = z.infer<typeof createBankTranscriptCandidateSchema>;
