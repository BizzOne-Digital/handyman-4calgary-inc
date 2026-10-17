import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { connectDb } from "@/lib/db/connect";
import { RateLimit } from "@/models/RateLimit";

/** Hashed client IP so raw addresses are never stored. */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256")
    .update(`${process.env.APP_SECRET ?? "h4c"}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Fixed-window counter persisted in MongoDB (works across serverless instances).
 * Returns whether this attempt is allowed and when the window resets.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  await connectDb();
  const now = new Date();
  let doc = await RateLimit.findOneAndUpdate(
    { _id: key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true },
  ).lean();
  if (!doc) {
    doc = await RateLimit.findOneAndUpdate(
      { _id: key },
      { $set: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
      { new: true, upsert: true },
    ).lean();
  }
  const count = doc?.count ?? 1;
  return { allowed: count <= limit, retryAt: doc?.expiresAt ?? now };
}

export async function resetRateLimit(key: string) {
  await connectDb();
  await RateLimit.deleteOne({ _id: key });
}
