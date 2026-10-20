import Link from "next/link";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { EnquiryEditor } from "@/components/admin/EnquiryEditor";
import { StatusBadge } from "@/components/admin/inputs";
import { CONTACT_METHOD_LABELS, DIVISION_LABELS, serviceLabel } from "@/lib/constants";
import { connectDb } from "@/lib/db/connect";
import { Enquiry } from "@/models/Enquiry";

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  await connectDb();
  const e = await Enquiry.findById(id).lean();
  if (!e) notFound();

  const rows: [string, React.ReactNode][] = [
    ["Reference", e.reference],
    ["Received", new Date(e.createdAt).toLocaleString("en-CA", { dateStyle: "full", timeStyle: "short" })],
    ["Type", e.kind === "quote" ? "Quote request" : "Contact message"],
    ["Division", e.division ? DIVISION_LABELS[e.division] : "—"],
    ["Service", e.serviceTitle || serviceLabel(e.service) || "—"],
    ["Project address", e.address || "—"],
    ["Preferred contact", e.preferredContact ? CONTACT_METHOD_LABELS[e.preferredContact] : "—"],
    ["Preferred consultation date", e.preferredDate ? `${e.preferredDate} (preference only, not confirmed)` : "—"],
    ["Submitted from", e.sourcePage || "—"],
    ["Email notification", e.emailNotified ? "Sent" : "Not sent"],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All enquiries
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{e.name}</h1>
        <StatusBadge status={e.status} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[4px] border border-line bg-white p-5">
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry ${e.reference}`)}`} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] bg-ink px-3 text-sm font-semibold text-white">
                <Mail aria-hidden="true" className="h-4 w-4" /> {e.email}
              </a>
              {e.phone && (
                <a href={`tel:${e.phone.replace(/[^+0-9]/g, "")}`} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line px-3 text-sm font-semibold hover:border-ink">
                  <Phone aria-hidden="true" className="h-4 w-4" /> {e.phone}
                </a>
              )}
            </div>
            <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-muted">Message</h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{e.message}</p>
          </section>
          <section className="rounded-[4px] border border-line bg-white">
            <dl className="divide-y divide-line text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[220px_1fr]">
                  <dt className="font-semibold text-muted">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <EnquiryEditor id={id} status={e.status} notes={e.internalNotes ?? ""} reference={e.reference} />
      </div>
    </>
  );
}
