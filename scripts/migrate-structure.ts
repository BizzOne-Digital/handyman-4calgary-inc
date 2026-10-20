/**
 * One-time migration to the October 2026 service structure (10 pages, services in groups).
 * Safe to re-run. Content still matching the original seed is replaced; anything edited in the
 * admin is kept and reported instead of being overwritten.
 *   npm run migrate:structure
 */
import "./env";
import mongoose from "mongoose";
import { PAGE_SLUGS } from "@/lib/constants";
import { DEFAULT_PAGES, DEFAULT_PROJECTS, DEFAULT_SERVICES, RETIRED_SERVICE_KEYS } from "@/lib/content/defaults";
import { connectDb } from "@/lib/db/connect";
import { deleteUploadIfUnreferenced } from "@/lib/uploads/store";
import { PageContent } from "@/models/PageContent";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";

/** Descriptions the previous seed wrote, used to tell untouched records from admin edits. */
const PREVIOUS_SEED_DESCRIPTIONS: Record<string, string> = {
  "basement-development": "Planning, framing, drywall, layout improvements and interior finishing for new and existing basements.",
  "kitchen-bathroom-renovations":
    "Kitchen and bathroom remodeling, cabinet installation, finishing and fixture-related improvements within confirmed scope.",
  "home-improvements-maintenance":
    "Interior and exterior painting, drywall and framing, carpentry, doors and trim, general repairs and ongoing residential maintenance.",
  "commercial-renovations":
    "Interior renovations and tenant improvements that prepare commercial spaces for new occupants or new ways of working, including drywall, framing, painting and carpentry.",
  "office-retail-improvements":
    "Office and retail improvements such as partition walls, finishes, repainting, millwork and layout updates, planned around your operations.",
  "facility-industrial-maintenance":
    "Commercial repairs, building upkeep, and industrial building repairs and maintenance within confirmed scope, on a project basis or as ongoing maintenance.",
};
const RETIRED_PAGE_SLUGS = ["basement-development", "kitchen-bathroom-renovations", "home-improvements-maintenance"];
/** Pages whose copy changed in this restructure. */
const REWRITTEN_PAGES = ["residential", "commercial-industrial"] as const;

const report: string[] = [];

async function main() {
  await connectDb();
  await Service.syncIndexes();
  await Project.syncIndexes();

  // 1. Retired services
  for (const key of RETIRED_SERVICE_KEYS) {
    const doc = await Service.findOne({ key }).lean();
    if (!doc) continue;
    if (doc.description === PREVIOUS_SEED_DESCRIPTIONS[key]) {
      await Service.deleteOne({ _id: doc._id });
      await deleteUploadIfUnreferenced(doc.image);
      report.push(`Removed retired service "${doc.title}" (unchanged seed copy).`);
    } else {
      await Service.updateOne({ _id: doc._id }, { $set: { status: "draft" } });
      report.push(`KEPT edited service "${doc.title}" as a draft. Assign it a group in Admin → Services or delete it.`);
    }
  }

  // 2. New service catalogue
  for (const s of DEFAULT_SERVICES) {
    const doc = await Service.findOne({ key: s.key }).lean();
    if (!doc) {
      await Service.create({ ...s, status: "published" });
      report.push(`Added service "${s.title}".`);
    } else if (!doc.group) {
      const untouched = doc.description === PREVIOUS_SEED_DESCRIPTIONS[s.key];
      await Service.updateOne(
        { _id: doc._id },
        { $set: untouched ? { ...s } : { group: s.group, division: s.division } },
      );
      report.push(untouched ? `Updated service "${s.title}" to the new copy.` : `Assigned group to edited service "${doc.title}" (copy kept).`);
    }
  }

  // 3. Pages: remove retired slugs, refresh rewritten pages if unedited
  const isUnedited = (p: { publishedAt?: Date; createdAt: Date; hasUnpublishedChanges: boolean }) =>
    !p.hasUnpublishedChanges && p.publishedAt && Math.abs(+new Date(p.publishedAt) - +new Date(p.createdAt)) < 120_000;

  for (const slug of RETIRED_PAGE_SLUGS) {
    const doc = await PageContent.collection.findOne({ slug });
    if (!doc) continue;
    if (isUnedited(doc as never)) {
      await PageContent.collection.deleteOne({ _id: doc._id });
      report.push(`Removed retired page content "${slug}".`);
    } else {
      report.push(`KEPT edited content for retired page "${slug}" (no longer shown). Copy anything useful into the new pages.`);
    }
  }
  for (const slug of REWRITTEN_PAGES) {
    const doc = await PageContent.findOne({ slug }).lean();
    const data = DEFAULT_PAGES[slug];
    if (!doc || doc.published?.hero?.heading === data.hero.heading) continue;
    if (isUnedited(doc)) {
      await PageContent.updateOne({ slug }, { $set: { draft: data, published: data } }, { timestamps: false });
      report.push(`Updated "${slug}" page copy for the new structure.`);
    } else {
      report.push(`KEPT edited "${slug}" page copy. Review it against the new service structure.`);
    }
  }
  const now = new Date();
  for (const slug of PAGE_SLUGS) {
    const r = await PageContent.updateOne(
      { slug },
      { $setOnInsert: { slug, draft: DEFAULT_PAGES[slug], published: DEFAULT_PAGES[slug], hasUnpublishedChanges: false, publishedAt: now } },
      { upsert: true },
    );
    if (r.upsertedCount) report.push(`Created page "${slug}".`);
  }

  // 4. Link seeded gallery examples to services
  for (const p of DEFAULT_PROJECTS) {
    if (!p.serviceKey) continue;
    const r = await Project.updateMany(
      { title: p.title, illustrative: true, $or: [{ serviceKey: { $exists: false } }, { serviceKey: "" }] },
      { $set: { serviceKey: p.serviceKey } },
    );
    if (r.modifiedCount) report.push(`Linked example "${p.title}" to ${p.serviceKey}.`);
  }

  console.log(report.length ? report.map((l) => `- ${l}`).join("\n") : "Nothing to migrate.");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
