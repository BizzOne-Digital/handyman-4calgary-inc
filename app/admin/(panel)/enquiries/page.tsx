import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/inputs";
import { DIVISION_LABELS, ENQUIRY_STATUSES, ENQUIRY_STATUS_LABELS, serviceLabel, type EnquiryStatus } from "@/lib/constants";
import { connectDb } from "@/lib/db/connect";
import { Enquiry } from "@/models/Enquiry";

const PAGE_SIZE = 25;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = (ENQUIRY_STATUSES as readonly string[]).includes(sp.status ?? "") ? (sp.status as EnquiryStatus) : undefined;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Number(sp.page) || 1);

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { email: rx }, { reference: rx }, { phone: rx }];
  }

  await connectDb();
  const [items, total] = await Promise.all([
    Enquiry.find(filter).select("-message -internalNotes").sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
    Enquiry.countDocuments(filter),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (p: Record<string, string | number | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ status, q: q || undefined, ...p })) if (v) u.set(k, String(v));
    const s = u.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <AdminHeader title="Enquiries" description="Quote requests and contact messages from the website." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {[undefined, ...ENQUIRY_STATUSES].map((s) => (
            <Link key={s ?? "all"} href={`/admin/enquiries${qs({ status: s, page: undefined })}`}
              aria-current={status === s ? "page" : undefined}
              className={`inline-flex min-h-10 items-center rounded-[3px] border px-3 text-sm font-medium ${status === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
              {s ? ENQUIRY_STATUS_LABELS[s] : "All"}
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="q" className="sr-only">Search enquiries</label>
          <input id="q" name="q" defaultValue={q} placeholder="Name, email, phone or reference" className="field-input min-h-10 w-full lg:w-72" />
          <button type="submit" className="inline-flex min-h-10 items-center rounded-[3px] bg-ink px-4 text-sm font-semibold text-white">Search</button>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[4px] border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No enquiries found.</p>
          <p className="mt-1 text-sm text-muted">{q || status ? "Try a different filter or search." : "Website form submissions will appear here."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[4px] border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Received</th>
                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                <th scope="col" className="px-4 py-3 font-semibold">Division / service</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((e) => (
                <tr key={String(e._id)} className="hover:bg-mist">
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(e.createdAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/enquiries/${e._id}`} className="font-semibold hover:underline">{e.name}</Link>
                    <span className="block text-xs text-subtle">{e.reference}</span>
                  </td>
                  <td className="px-4 py-3">{e.kind === "quote" ? "Quote" : "Contact"}</td>
                  <td className="px-4 py-3 text-muted">
                    {e.division ? DIVISION_LABELS[e.division] : "—"}
                    {e.service && <span className="block text-xs">{e.serviceTitle || serviceLabel(e.service)}</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-5 flex items-center justify-between text-sm">
          <span className="text-muted">Page {page} of {pages} · {total} enquiries</span>
          <span className="flex gap-2">
            {page > 1 && <Link href={`/admin/enquiries${qs({ page: page - 1 })}`} className="inline-flex min-h-10 items-center rounded-[3px] border border-line bg-white px-3 hover:border-ink">Previous</Link>}
            {page < pages && <Link href={`/admin/enquiries${qs({ page: page + 1 })}`} className="inline-flex min-h-10 items-center rounded-[3px] border border-line bg-white px-3 hover:border-ink">Next</Link>}
          </span>
        </nav>
      )}
    </>
  );
}
