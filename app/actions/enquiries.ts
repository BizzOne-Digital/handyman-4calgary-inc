"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { connectDb, isDbConfigured } from "@/lib/db/connect";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { notifyNewEnquiry } from "@/lib/notify";
import { contactSchema, flattenErrors, quoteSchema, type FieldErrors } from "@/lib/validation/enquiry";
import { Enquiry } from "@/models/Enquiry";

export type EnquiryResult =
  | { ok: true; reference: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

const MIN_FILL_MS = 2500;
const LIMIT = 5;
const WINDOW_SECONDS = 15 * 60;

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `H4C-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

async function save(data: Record<string, unknown>): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = makeReference();
    try {
      await Enquiry.create({ ...data, reference });
      return reference;
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err;
    }
  }
  throw new Error("Could not generate a unique reference");
}

async function guard(startedAt: number | undefined, website: string | undefined): Promise<EnquiryResult | null> {
  if (website) return { ok: false, message: "Your submission could not be accepted." };
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, message: "Please take a moment to review your details, then submit again." };
  }
  if (!isDbConfigured()) {
    return { ok: false, message: "Online submissions are temporarily unavailable. Please call or email us." };
  }
  await connectDb();
  const { allowed } = await rateLimit(`enquiry:${await clientKey()}`, LIMIT, WINDOW_SECONDS);
  if (!allowed) {
    return { ok: false, message: "Too many submissions from your connection. Please try again later or call us." };
  }
  return null;
}

export async function submitQuote(input: unknown): Promise<EnquiryResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please correct the highlighted fields.", fieldErrors: flattenErrors(parsed.error) };
  }
  const { website, startedAt, ...v } = parsed.data;
  try {
    const blocked = await guard(startedAt, website);
    if (blocked) return blocked;
    const doc = {
      kind: "quote" as const,
      name: v.name,
      email: v.email,
      phone: v.phone,
      division: v.division,
      service: v.service,
      address: v.address || undefined,
      message: v.message,
      preferredContact: v.preferredContact,
      preferredDate: v.preferredDate || undefined,
      sourcePage: v.sourcePage || undefined,
    };
    const reference = await save(doc);
    const notified = await notifyNewEnquiry({ ...doc, reference });
    if (notified) await Enquiry.updateOne({ reference }, { $set: { emailNotified: true } });
    revalidatePath("/admin", "layout");
    return { ok: true, reference };
  } catch (err) {
    console.error("[enquiry] quote save failed", err);
    return { ok: false, message: "We could not send your request. Please try again or call us directly." };
  }
}

export async function submitContact(input: unknown): Promise<EnquiryResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please correct the highlighted fields.", fieldErrors: flattenErrors(parsed.error) };
  }
  const { website, startedAt, ...v } = parsed.data;
  try {
    const blocked = await guard(startedAt, website);
    if (blocked) return blocked;
    const doc = {
      kind: "contact" as const,
      name: v.name,
      email: v.email,
      phone: v.phone || "",
      division: v.division || undefined,
      message: v.message,
      sourcePage: v.sourcePage || undefined,
    };
    const reference = await save(doc);
    const notified = await notifyNewEnquiry({ ...doc, reference });
    if (notified) await Enquiry.updateOne({ reference }, { $set: { emailNotified: true } });
    revalidatePath("/admin", "layout");
    return { ok: true, reference };
  } catch (err) {
    console.error("[enquiry] contact save failed", err);
    return { ok: false, message: "We could not send your message. Please try again or call us directly." };
  }
}
