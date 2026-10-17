/**
 * Deletes stored uploads that no content references and that are older than N hours (default 24).
 * These are images uploaded in the admin but never saved (cancelled edits).
 *   npm run cleanup:uploads            # older than 24h
 *   npm run cleanup:uploads -- 72      # older than 72h
 */
import "./env";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connect";
import { cleanupAbandonedUploads } from "@/lib/uploads/store";

async function main() {
  const hours = Math.max(1, Number(process.argv[2]) || 24);
  await connectDb();
  const r = await cleanupAbandonedUploads(hours);
  console.log(`Checked ${r.checked} uploads older than ${hours}h; deleted ${r.deleted} unreferenced.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
