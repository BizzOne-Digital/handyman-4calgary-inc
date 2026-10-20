import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/inputs";
import { DIVISION_LABELS, ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, serviceLabel } from "@/lib/constants";
import { connectDb } from "@/lib/db/connect";
import { Enquiry } from "@/models/Enquiry";
import { PageContent } from "@/models/PageContent";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { StoredUpload } from "@/models/StoredUpload";

const fmtBytes = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default async function Dashboard() {
  await connectDb();
  const [statusCounts, totalEnquiries, servicesPublished, servicesTotal, projectsPublished, projectsTotal, pagesPublished, pagesChanged, uploadStats, recent] =
    await Promise.all([
      Enquiry.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
      Enquiry.countDocuments(),
      Service.countDocuments({ status: "published" }),
      Service.countDocuments(),
      Project.countDocuments({ status: "published" }),
      Project.countDocuments(),
      PageContent.countDocuments({ published: { $ne: null } }),
      PageContent.countDocuments({ hasUnpublishedChanges: true }),
      StoredUpload.aggregate<{ n: number; bytes: number }>([{ $group: { _id: null, n: { $sum: 1 }, bytes: { $sum: "$size" } } }]),
      Enquiry.find({}).select("reference name kind division service serviceTitle status createdAt").sort({ createdAt: -1 }).limit(6).lean(),
    ]);
  const byStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.n]));
  const uploads = uploadStats[0] ?? { n: 0, bytes: 0 };

  const cards = [
    { label: "New enquiries", value: byStatus.new ?? 0, sub: `${totalEnquiries} total`, href: "/admin/enquiries?status=new" },
    { label: "Published pages", value: `${pagesPublished}/10`, sub: pagesChanged ? `${pagesChanged} with unpublished changes` : "All changes published", href: "/admin/pages" },
    { label: "Published services", value: servicesPublished, sub: `${servicesTotal} total`, href: "/admin/services" },
    { label: "Published projects", value: projectsPublished, sub: `${projectsTotal} total`, href: "/admin/projects" },
    { label: "Stored images", value: uploads.n, sub: fmtBytes(uploads.bytes), href: "/admin/media" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" description="Live figures from the website database." />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <li key={c.label}>
            <Link href={c.href} className="block h-full rounded-[4px] border border-line bg-white p-5 transition-colors hover:border-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{c.label}</p>
              <p className="mt-2 text-3xl font-bold">{c.value}</p>
              <p className="mt-1 text-xs text-subtle">{c.sub}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-[4px] border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-bold">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
              View all <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </header>
          {recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">No enquiries yet. Submissions from the website forms will appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((e) => (
                <li key={String(e._id)}>
                  <Link href={`/admin/enquiries/${e._id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-mist">
                    <span className="min-w-0">
                      <span className="block font-semibold">{e.name}</span>
                      <span className="block text-xs text-muted">
                        {e.reference} · {e.kind === "quote" ? "Quote" : "Contact"}
                        {e.division ? ` · ${DIVISION_LABELS[e.division]}` : ""}
                        {e.service ? ` · ${e.serviceTitle || serviceLabel(e.service)}` : ""}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <time className="text-xs text-subtle" dateTime={new Date(e.createdAt).toISOString()}>
                        {new Date(e.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                      </time>
                      <StatusBadge status={e.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[4px] border border-line bg-white">
          <header className="border-b border-line px-5 py-4">
            <h2 className="font-bold">Enquiries by status</h2>
          </header>
          <ul className="divide-y divide-line">
            {ENQUIRY_STATUSES.map((s) => (
              <li key={s}>
                <Link href={`/admin/enquiries?status=${s}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-mist">
                  {ENQUIRY_STATUS_LABELS[s]}
                  <span className="font-bold">{byStatus[s] ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
