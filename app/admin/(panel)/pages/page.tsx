import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/inputs";
import { PAGE_NAMES, PAGE_PATHS, PAGE_SLUGS } from "@/lib/constants";
import { DEFAULT_PAGES } from "@/lib/content/defaults";
import { connectDb } from "@/lib/db/connect";
import { PageContent } from "@/models/PageContent";


export default async function PagesList() {
  await connectDb();
  const docs = await PageContent.find({}, { slug: 1, published: 1, hasUnpublishedChanges: 1, updatedAt: 1, publishedAt: 1 }).lean();
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  return (
    <>
      <AdminHeader title="Pages" description="Edit hero content, introductions, images, FAQs and SEO for each public page." />
      <div className="overflow-hidden rounded-[4px] border border-line bg-white">
        <ul className="divide-y divide-line">
          {PAGE_SLUGS.map((slug) => {
            const d = bySlug.get(slug);
            return (
              <li key={slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold">{PAGE_NAMES[slug]}</p>
                  <p className="text-xs text-muted">
                    {PAGE_PATHS[slug]} · {(d?.published ?? DEFAULT_PAGES[slug]).seoTitle}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {d?.published ? <StatusBadge status="published" /> : <StatusBadge status="draft" />}
                  {d?.hasUnpublishedChanges && <StatusBadge status="changes" />}
                  {!d?.published && <span className="text-xs text-subtle">Showing default content</span>}
                  <a href={PAGE_PATHS[slug]} target="_blank" rel="noopener" aria-label={`View ${PAGE_NAMES[slug]} page`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] border border-line hover:border-ink">
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                  <Link href={`/admin/pages/${slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-[3px] bg-ink px-4 text-sm font-semibold text-white hover:bg-graphite">
                    <Pencil aria-hidden="true" className="h-4 w-4" /> Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
