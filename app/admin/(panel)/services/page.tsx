import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/inputs";
import { SafeImage } from "@/components/ui/SafeImage";
import { DIVISION_LABELS, SERVICE_GROUPS, serviceHref } from "@/lib/constants";
import { connectDb } from "@/lib/db/connect";
import { Service } from "@/models/Service";

export default async function ServicesList() {
  await connectDb();
  const services = await Service.find({}).sort({ order: 1, title: 1 }).lean();

  return (
    <>
      <AdminHeader
        title="Services"
        description="Every service on the website, grouped the way it appears on the pages. Each service has its own image, description and quote link."
        actions={
          <Link href="/admin/services/new" className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-ink px-4 text-sm font-semibold text-white hover:bg-graphite">
            <Plus aria-hidden="true" className="h-4 w-4" /> New service
          </Link>
        }
      />
      {services.length === 0 ? (
        <div className="rounded-[4px] border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No services in the database yet.</p>
          <p className="mt-1 text-sm text-muted">Run <code className="rounded bg-mist px-1">npm run seed</code> to load the initial services, or create one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {SERVICE_GROUPS.map((g) => {
            const list = services.filter((s) => s.group === g.key);
            return (
              <section key={g.key} className="rounded-[4px] border border-line bg-white">
                <h2 className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-3.5">
                  <span className="font-bold">{g.title}</span>
                  <span className="text-xs font-medium text-muted">{DIVISION_LABELS[g.division]} · {g.path}</span>
                </h2>
                {list.length === 0 ? (
                  <p className="p-5 text-sm text-muted">No services in this group yet.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {list.map((s) => (
                      <li key={String(s._id)} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[2px] bg-mist">
                          <SafeImage src={s.image} alt="" fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{s.title}</p>
                          <p className="truncate text-xs text-muted">
                            Order {s.order} · {serviceHref(s.group, s.key)}
                          </p>
                        </div>
                        <StatusBadge status={s.status} />
                        <Link href={`/admin/services/${s._id}`} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line px-3 text-sm font-medium hover:border-ink">
                          <Pencil aria-hidden="true" className="h-4 w-4" /> Edit
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
          {services.some((s) => !s.group) && (
            <p className="rounded-[4px] border border-danger/30 bg-white p-4 text-sm text-danger">
              Some services have no group and are hidden from the website. Run <code>npm run migrate:structure</code> or edit them to choose a group.
            </p>
          )}
        </div>
      )}
    </>
  );
}
