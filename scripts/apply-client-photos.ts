/**
 * Applies the client's real project photos (public/images/projects) to existing content.
 * Only AI placeholder images (lib/content/images.ts → IMG) are replaced; admin uploads and
 * custom images are never touched. Safe to re-run.
 *   npm run apply:photos
 */
import "./env";
import mongoose from "mongoose";
import { PAGE_SLUGS } from "@/lib/constants";
import { DEFAULT_PAGES, DEFAULT_PROJECTS, DEFAULT_SERVICES } from "@/lib/content/defaults";
import { IMG, resolveImageUrl } from "@/lib/content/images";
import { connectDb } from "@/lib/db/connect";
import { PageContent, type PageData } from "@/models/PageContent";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";

const PLACEHOLDERS = new Set<string>(Object.values(IMG));
const isPlaceholder = (url?: string | null) => !url || PLACEHOLDERS.has(resolveImageUrl(url));
const isRealPhoto = (url?: string | null) => Boolean(url?.startsWith("/images/projects/"));
const report: string[] = [];

/** Returns an updated copy of a page's data, swapping placeholder images for the new defaults. */
function swapPageImages(data: PageData, defaults: PageData): { next: PageData; changed: number } {
  const next = JSON.parse(JSON.stringify(data)) as PageData;
  let changed = 0;
  if (isRealPhoto(defaults.hero.image) && isPlaceholder(next.hero?.image) && next.hero.image !== defaults.hero.image) {
    next.hero.image = defaults.hero.image;
    next.hero.imageAlt = defaults.hero.imageAlt;
    changed++;
  }
  for (const d of defaults.media) {
    const m = next.media?.find((x) => x.key === d.key);
    if (m && isRealPhoto(d.url) && isPlaceholder(m.url) && m.url !== d.url) {
      m.url = d.url;
      m.alt = d.alt;
      changed++;
    }
  }
  return { next, changed };
}

async function main() {
  await connectDb();

  // Services
  for (const s of DEFAULT_SERVICES) {
    if (!isRealPhoto(s.image)) continue;
    const doc = await Service.findOne({ key: s.key }, { image: 1, title: 1 }).lean();
    if (doc && isPlaceholder(doc.image) && doc.image !== s.image) {
      await Service.updateOne({ _id: doc._id }, { $set: { image: s.image, imageAlt: s.imageAlt } });
      report.push(`Service "${doc.title}": real photo applied.`);
    }
  }

  // Pages (draft and published)
  for (const slug of PAGE_SLUGS) {
    const doc = await PageContent.findOne({ slug }).lean();
    if (!doc) continue;
    const set: Record<string, PageData> = {};
    let n = 0;
    for (const field of ["draft", "published"] as const) {
      const data = doc[field];
      if (!data) continue;
      const { next, changed } = swapPageImages(data, DEFAULT_PAGES[slug]);
      if (changed) {
        set[field] = next;
        n = Math.max(n, changed);
      }
    }
    if (Object.keys(set).length) {
      await PageContent.updateOne({ slug }, { $set: set }, { timestamps: false });
      report.push(`Page "${slug}": ${n} image${n === 1 ? "" : "s"} replaced with real photos.`);
    }
  }

  // Gallery: add real photos, retire residential placeholders now that real residential photos exist
  let added = 0;
  for (const p of DEFAULT_PROJECTS.filter((x) => !x.illustrative)) {
    const r = await Project.updateOne({ image: p.image }, { $setOnInsert: { ...p, status: "published" } }, { upsert: true });
    added += r.upsertedCount;
  }
  if (added) report.push(`Gallery: ${added} real project photos added.`);
  const hidden = await Project.updateMany(
    { illustrative: true, category: "residential", status: "published" },
    { $set: { status: "draft" } },
  );
  if (hidden.modifiedCount) report.push(`Gallery: ${hidden.modifiedCount} residential illustrative examples set to draft (kept, not deleted).`);

  console.log(report.length ? report.map((l) => `- ${l}`).join("\n") : "Nothing to apply.");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
