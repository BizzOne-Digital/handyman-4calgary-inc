/**
 * Replaces the original Unsplash stock-photo URLs saved in MongoDB with the bundled
 * /images/*.webp files. Admin uploads and custom images are left untouched. Safe to re-run.
 *   npm run migrate:images
 */
import "./env";
import mongoose from "mongoose";
import { resolveImageUrl } from "@/lib/content/images";
import { connectDb } from "@/lib/db/connect";
import { PageContent } from "@/models/PageContent";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { SiteSettings } from "@/models/SiteSettings";

/** Returns a copy with every Unsplash string remapped, plus whether anything changed. */
function remap<T>(value: T): { value: T; changed: boolean } {
  let changed = false;
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") {
      const next = resolveImageUrl(v);
      if (next !== v) changed = true;
      return next;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object" && !(v instanceof Date) && !mongoose.isValidObjectId(v)) {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    }
    return v;
  };
  return { value: walk(value) as T, changed };
}

async function main() {
  await connectDb();
  let updated = 0;

  for (const p of await PageContent.find({}, { draft: 1, published: 1 }).lean()) {
    const d = remap(p.draft);
    const pub = remap(p.published);
    if (d.changed || pub.changed) {
      await PageContent.updateOne({ _id: p._id }, { $set: { draft: d.value, published: pub.value } });
      updated++;
    }
  }
  for (const s of await Service.find({}, { image: 1 }).lean()) {
    const next = resolveImageUrl(s.image);
    if (next !== s.image) {
      await Service.updateOne({ _id: s._id }, { $set: { image: next } });
      updated++;
    }
  }
  for (const p of await Project.find({}, { image: 1 }).lean()) {
    const next = resolveImageUrl(p.image);
    if (next !== p.image) {
      await Project.updateOne({ _id: p._id }, { $set: { image: next } });
      updated++;
    }
  }
  for (const s of await SiteSettings.find({}, { logoUrl: 1, ogImage: 1 }).lean()) {
    const og = resolveImageUrl(s.ogImage);
    if (og !== s.ogImage) {
      await SiteSettings.updateOne({ _id: s._id }, { $set: { ogImage: og } });
      updated++;
    }
  }

  console.log(`Image migration complete: ${updated} document(s) updated.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
