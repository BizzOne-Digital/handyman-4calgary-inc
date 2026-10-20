import { z } from "zod";
import { CONTACT_METHODS, DIVISIONS } from "@/lib/constants";

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label} is required.` })
    .trim()
    .min(min, min <= 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const phone = z
  .string()
  .trim()
  .max(30, "Phone number is too long.")
  .regex(/^[+()\-.\s0-9]{7,30}$/, "Enter a valid phone number.");

/** Spam controls shared by both forms. `website` is a hidden honeypot field. */
const spamFields = {
  website: z.string().max(0, "Submission rejected.").optional().default(""),
  startedAt: z.coerce.number().int().nonnegative().optional(),
};

export const quoteSchema = z
  .object({
    name: trimmed(2, 100, "Name"),
    email: z.string().trim().max(200).email("Enter a valid email address."),
    phone,
    division: z.enum(DIVISIONS, { errorMap: () => ({ message: "Choose a project type." }) }),
    service: z
      .string()
      .trim()
      .min(1, "Choose the service you need.")
      .max(80)
      .regex(/^[a-z0-9-]+$/, "Choose the service you need."),
    address: z.string().trim().max(200, "Address must be 200 characters or fewer.").optional().default(""),
    message: trimmed(10, 3000, "Project description"),
    preferredContact: z.enum(CONTACT_METHODS).optional().default("either"),
    preferredDate: z
      .string()
      .trim()
      .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Enter a valid date.")
      .optional()
      .default(""),
    sourcePage: z.string().trim().max(200).optional().default(""),
    ...spamFields,
  })
  .superRefine((v, ctx) => {
    if (v.preferredDate) {
      const d = new Date(`${v.preferredDate}T12:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const max = new Date(today.getTime() + 366 * 24 * 3600 * 1000);
      if (Number.isNaN(d.getTime()) || d < today || d > max) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choose a date within the next year." });
      }
    }
  });

export const contactSchema = z.object({
  name: trimmed(2, 100, "Name"),
  email: z.string().trim().max(200).email("Enter a valid email address."),
  phone: z.union([z.literal(""), phone]).optional().default(""),
  division: z.union([z.literal(""), z.enum(DIVISIONS)]).optional().default(""),
  message: trimmed(10, 3000, "Message"),
  sourcePage: z.string().trim().max(200).optional().default(""),
  ...spamFields,
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type ContactInput = z.input<typeof contactSchema>;

export type FieldErrors = Record<string, string>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
