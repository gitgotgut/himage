import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

export const albumCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: optionalText(2000),
  visibility: z.enum(["OPEN", "INVITE_ONLY"]).default("INVITE_ONLY"),
});

export const albumUpdateSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: optionalText(2000),
    visibility: z.enum(["OPEN", "INVITE_ONLY"]).optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one field is required",
  });

export const photoCaptionSchema = z.object({
  caption: optionalText(500),
});

export const shareSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>;
