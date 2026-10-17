import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
import { PAGE_NAMES, PAGE_PATHS, PAGE_SLUGS, type PageSlug } from "@/lib/constants";
import { DEFAULT_PAGES, PAGES_WITH_HERO_IMAGE } from "@/lib/content/defaults";
import { connectDb } from "@/lib/db/connect";
import { PageContent, type PageData } from "@/models/PageContent";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(PAGE_SLUGS as readonly string[]).includes(slug)) notFound();
  const s = slug as PageSlug;
  await connectDb();
  const doc = await PageContent.findOne({ slug: s }).lean();
  const defaults = DEFAULT_PAGES[s];
  const draft: PageData = doc?.draft ? (JSON.parse(JSON.stringify(doc.draft)) as PageData) : defaults;
  if (!draft.faqs?.length) draft.faqs = defaults.faqs;

  // Always show every image slot defined for this page.
  const media = defaults.media.map((m) => ({ ...m, ...(draft.media?.find((d) => d.key === m.key) ?? {}), label: m.label }));

  return (
    <PageEditor
      slug={s}
      name={PAGE_NAMES[s]}
      path={PAGE_PATHS[s]}
      initial={{ ...defaults, ...draft, media, faqs: draft.faqs ?? [] }}
      isPublished={Boolean(doc?.published)}
      hasChanges={Boolean(doc?.hasUnpublishedChanges)}
      publishedAt={doc?.publishedAt ? new Date(doc.publishedAt).toISOString() : null}
      showHeroImage={PAGES_WITH_HERO_IMAGE.includes(s)}
      showIntro={!["projects", "request-a-quote", "contact"].includes(s)}
    />
  );
}
