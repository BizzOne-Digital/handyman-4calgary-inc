/**
 * Idempotent seed: inserts initial content only where it does not already exist.
 * Safe to run repeatedly; never overwrites admin edits.
 *   npm run seed
 */
import "./env";
import mongoose from "mongoose";
import { PAGE_SLUGS } from "@/lib/constants";
import { DEFAULT_PAGES, DEFAULT_PROJECTS, DEFAULT_SERVICES, DEFAULT_SETTINGS } from "@/lib/content/defaults";
import { connectDb } from "@/lib/db/connect";
import { PageContent } from "@/models/PageContent";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { SiteSettings } from "@/models/SiteSettings";
import { AdminUser } from "@/models/AdminUser";
import { AdminSession } from "@/models/AdminSession";
import { Enquiry } from "@/models/Enquiry";
import { RateLimit } from "@/models/RateLimit";
import { StoredUpload } from "@/models/StoredUpload";
import { UploadChunk } from "@/models/UploadChunk";

async function main() {
  await connectDb();
  // Make sure all indexes (unique, TTL) exist.
  await Promise.all(
    [PageContent, Project, Service, SiteSettings, AdminUser, AdminSession, Enquiry, RateLimit, StoredUpload, UploadChunk].map((m) =>
      (m as mongoose.Model<unknown>).syncIndexes(),
    ),
  );

  const settings = await SiteSettings.updateOne({ key: "site" }, { $setOnInsert: { ...DEFAULT_SETTINGS, key: "site" } }, { upsert: true });
  console.log(`Settings: ${settings.upsertedCount ? "created" : "kept existing"}`);

  let pagesCreated = 0;
  for (const slug of PAGE_SLUGS) {
    const data = DEFAULT_PAGES[slug];
    const r = await PageContent.updateOne(
      { slug },
      { $setOnInsert: { slug, draft: data, published: data, hasUnpublishedChanges: false, publishedAt: new Date() } },
      { upsert: true },
    );
    pagesCreated += r.upsertedCount;
  }
  console.log(`Pages: ${pagesCreated} created, ${PAGE_SLUGS.length - pagesCreated} kept existing`);

  let servicesCreated = 0;
  for (const s of DEFAULT_SERVICES) {
    const r = await Service.updateOne({ key: s.key }, { $setOnInsert: { ...s, status: "published" } }, { upsert: true });
    servicesCreated += r.upsertedCount;
  }
  console.log(`Services: ${servicesCreated} created, ${DEFAULT_SERVICES.length - servicesCreated} kept existing`);

  // Gallery examples are only added to an empty gallery, so deleted examples stay deleted.
  if ((await Project.estimatedDocumentCount()) === 0) {
    await Project.insertMany(DEFAULT_PROJECTS.map((p) => ({ ...p, illustrative: true, status: "published" })));
    console.log(`Projects: ${DEFAULT_PROJECTS.length} illustrative examples created`);
  } else {
    console.log("Projects: gallery already has items, skipped");
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
