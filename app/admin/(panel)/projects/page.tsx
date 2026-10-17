import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/inputs";
import { SafeImage } from "@/components/ui/SafeImage";
import { DIVISION_LABELS } from "@/lib/constants";
import { connectDb } from "@/lib/db/connect";
import { Project } from "@/models/Project";

export default async function ProjectsList() {
  await connectDb();
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();

  return (
    <>
      <AdminHeader
        title="Projects"
        description="Gallery items on the Projects page. Mark stock photography as illustrative."
        actions={
          <Link href="/admin/projects/new" className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-ink px-4 text-sm font-semibold text-white hover:bg-graphite">
            <Plus aria-hidden="true" className="h-4 w-4" /> New project
          </Link>
        }
      />
      {projects.length === 0 ? (
        <div className="rounded-[4px] border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No projects yet.</p>
          <p className="mt-1 text-sm text-muted">Add your first project, or run <code className="rounded bg-mist px-1">npm run seed</code> for illustrative examples.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <li key={String(p._id)} className="overflow-hidden rounded-[4px] border border-line bg-white">
              <div className="relative aspect-[16/10] bg-mist">
                <SafeImage src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={p.status} />
                  {p.illustrative && <span className="text-[11px] font-medium text-muted">Illustrative</span>}
                  <span className="ml-auto text-xs text-subtle">Order {p.order}</span>
                </div>
                <p className="mt-2 font-semibold">{p.title}</p>
                <p className="text-xs text-muted">{DIVISION_LABELS[p.category]}</p>
                <Link href={`/admin/projects/${p._id}`} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line px-3 text-sm font-medium hover:border-ink">
                  <Pencil aria-hidden="true" className="h-4 w-4" /> Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
