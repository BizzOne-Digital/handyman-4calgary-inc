import { z } from "zod";
import { DIVISIONS, ENQUIRY_STATUSES } from "@/lib/constants";

const text = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`);
const required = (max: number, label: string) => text(max).min(1, `${label} is required.`);

/** Image URLs may only be stored uploads, selected Unsplash images or bundled assets (/brand, /images). */
export const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) =>
      v === "" ||
      /^\/api\/uploads\/(products|gallery|pages|misc)\/[0-9]{10,16}-[a-f0-9]{16}\.(png|jpg|webp|gif)$/.test(v) ||
      /^https:\/\/images\.unsplash\.com\/[\w\-./?=&%]+$/.test(v) ||
      /^\/(brand|images)\/[\w\-.]+$/.test(v),
    "Use an uploaded image.",
  );

/** Internal path, anchor, or https/tel/mailto link. */
export const linkHref = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^\/(?!\/)[\w\-./?=&#%]*$/.test(v) || /^(https:\/\/|tel:|mailto:)[^\s<>"']+$/.test(v), "Use a path like /contact or a full https:// link.");

export const pageDataSchema = z.object({
  seoTitle: text(70),
  seoDescription: text(170),
  hero: z.object({
    eyebrow: text(120),
    heading: required(160, "Heading"),
    description: text(400),
    ctaLabel: text(40),
    ctaHref: linkHref,
    image: imageUrl,
    imageAlt: text(200),
  }),
  intro: z.object({ heading: text(160), body: text(2000) }),
  media: z
    .array(z.object({ key: z.string().regex(/^[a-z0-9-]{1,60}$/), label: text(80), url: imageUrl, alt: text(200) }))
    .max(12),
  faqs: z.array(z.object({ question: required(200, "Question"), answer: required(1200, "Answer") })).max(20),
});
export type PageDataInput = z.infer<typeof pageDataSchema>;

export const serviceSchema = z.object({
  key: z
    .string()
    .trim()
    .min(2, "Key is required.")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens."),
  division: z.enum(DIVISIONS),
  title: required(120, "Title"),
  summary: text(300),
  description: text(2000),
  highlights: z.array(text(160)).max(10),
  href: linkHref,
  image: imageUrl,
  imageAlt: text(200),
  order: z.coerce.number().int().min(0).max(999),
  status: z.enum(["draft", "published"]),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const projectSchema = z
  .object({
    title: required(120, "Title"),
    category: z.enum(DIVISIONS),
    description: text(600),
    image: imageUrl.refine((v) => v !== "", "An image is required."),
    imageAlt: required(200, "Alt text"),
    illustrative: z.boolean(),
    order: z.coerce.number().int().min(0).max(999),
    status: z.enum(["draft", "published"]),
  });
export type ProjectInput = z.infer<typeof projectSchema>;

const httpsOrEmpty = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s<>"']+$/.test(v), "Use a full https:// link or leave empty.");

export const settingsSchema = z.object({
  businessName: required(100, "Business name"),
  tagline: text(160),
  phone: required(30, "Phone"),
  phoneHref: z.string().trim().regex(/^tel:\+?[0-9]{7,15}$/, "Use the format tel:+14033837013."),
  email: z.string().trim().email("Enter a valid email.").max(200),
  serviceArea: required(120, "Service area"),
  logoUrl: imageUrl,
  logoAlt: required(200, "Logo alt text"),
  footerText: text(300),
  social: z.object({
    facebook: httpsOrEmpty,
    instagram: httpsOrEmpty,
    linkedin: httpsOrEmpty,
    youtube: httpsOrEmpty,
    google: httpsOrEmpty,
  }),
  defaultSeoTitle: text(70),
  defaultSeoDescription: text(170),
  ogImage: imageUrl,
});
export type SettingsInput = z.infer<typeof settingsSchema>;

export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES),
  internalNotes: text(3000),
});

export type ActionResult<T = undefined> =
  | { ok: true; message: string; data?: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export function zodToFieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const k = i.path.join(".");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
