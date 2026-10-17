import "server-only";
import { DIVISION_LABELS, serviceLabel } from "@/lib/constants";
import type { EnquiryDoc } from "@/models/Enquiry";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Optional email notification via Resend (https://resend.com), enabled when RESEND_API_KEY is set.
 * Enquiries are already saved before this runs; a failure here never affects the visitor.
 */
export async function notifyNewEnquiry(e: Pick<EnquiryDoc, "reference" | "kind" | "name" | "email" | "phone" | "division" | "service" | "address" | "message" | "preferredContact" | "preferredDate">) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!key || !to || !from) return false;

  const rows: [string, string | undefined][] = [
    ["Reference", e.reference],
    ["Type", e.kind === "quote" ? "Quote request" : "Contact message"],
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
    ["Division", e.division ? DIVISION_LABELS[e.division] : ""],
    ["Service", serviceLabel(e.service)],
    ["Project address", e.address],
    ["Preferred contact", e.preferredContact],
    ["Preferred consultation date (not confirmed)", e.preferredDate],
  ];
  const html = `<h2>New website enquiry ${esc(e.reference)}</h2><table>${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${esc(k)}</b></td><td>${esc(String(v))}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${esc(e.message)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: e.email,
        subject: `New ${e.kind === "quote" ? "quote request" : "message"} ${e.reference} from ${e.name}`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch (err) {
    console.error("[notify] email failed", err);
    return false;
  }
}
