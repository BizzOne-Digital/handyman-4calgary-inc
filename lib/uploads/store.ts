import "server-only";
import { randomBytes } from "crypto";
import { connectDb } from "@/lib/db/connect";
import type { UploadFolder } from "@/lib/constants";
import { StoredUpload } from "@/models/StoredUpload";
import { PageContent } from "@/models/PageContent";
import { Service } from "@/models/Service";
import { Project } from "@/models/Project";
import { SiteSettings } from "@/models/SiteSettings";
import {
  MAX_UPLOAD_BYTES,
  MIME_EXT,
  isAllowedMime,
  parseUploadUrl,
  sniffImageType,
  uploadUrl,
} from "./validate";

export class UploadError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** Converts a binary field from a lean query (BSON Binary) or a hydrated doc (Buffer) to an exact Buffer. */
export function toBuffer(value: unknown): Buffer {
  if (Buffer.isBuffer(value)) return value;
  const bin = value as { buffer?: Uint8Array; position?: number } | null;
  if (bin?.buffer instanceof Uint8Array) {
    const end = typeof bin.position === "number" ? bin.position : bin.buffer.length;
    return Buffer.from(bin.buffer.subarray(0, end));
  }
  throw new Error("Unsupported binary value");
}

export type StoredResult ={ url: string; filename: string; size: number; folder: UploadFolder };

/** Validates bytes (size + real signature) and persists them as a StoredUpload. */
export async function storeImage(opts: {
  buffer: Buffer;
  declaredMime: string;
  folder: UploadFolder;
  ownerId?: string;
}): Promise<StoredResult> {
  const { buffer, declaredMime, folder, ownerId } = opts;
  if (buffer.length === 0) throw new UploadError("The file is empty.");
  if (buffer.length > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 8 MB or smaller.", 413);
  if (!isAllowedMime(declaredMime)) throw new UploadError("Only PNG, JPEG, WebP and GIF images are allowed.", 415);
  const actual = sniffImageType(buffer);
  if (!actual) throw new UploadError("The file is not a valid PNG, JPEG, WebP or GIF image.", 415);
  if (actual !== declaredMime) {
    throw new UploadError("The file contents do not match its declared image type.", 415);
  }

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${MIME_EXT[actual]}`;
  await connectDb();
  await StoredUpload.create({
    folder,
    filename,
    mimeType: actual,
    size: buffer.length,
    data: buffer,
    uploadedBy: ownerId,
  });
  return { url: uploadUrl(folder, filename), filename, size: buffer.length, folder };
}

/** All URLs referenced by content documents (pages, services, projects, settings). */
export async function collectReferencedUploadUrls(): Promise<Set<string>> {
  await connectDb();
  const [pages, services, projects, settings] = await Promise.all([
    PageContent.find({}, { draft: 1, published: 1 }).lean(),
    Service.find({}, { image: 1 }).lean(),
    Project.find({}, { image: 1 }).lean(),
    SiteSettings.find({}, { logoUrl: 1, ogImage: 1 }).lean(),
  ]);
  const found = new Set<string>();
  const scan = (value: unknown) => {
    const text = JSON.stringify(value);
    const re = /\/api\/uploads\/[a-z]+\/[A-Za-z0-9.-]+/g;
    for (const m of text.matchAll(re)) found.add(m[0]);
  };
  scan(pages);
  scan(services);
  scan(projects);
  scan(settings);
  return found;
}

export async function isUploadReferenced(url: string) {
  return (await collectReferencedUploadUrls()).has(url.split("?")[0]);
}

/**
 * Deletes a stored upload only if it is a MongoDB upload URL and nothing references it.
 * External URLs (e.g. Unsplash) are ignored. Never throws; returns what happened.
 */
export async function deleteUploadIfUnreferenced(url: string | null | undefined) {
  const parsed = parseUploadUrl(url);
  if (!parsed) return { deleted: false, reason: "not-an-upload" as const };
  try {
    if (await isUploadReferenced(url!)) return { deleted: false, reason: "still-referenced" as const };
    const res = await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
    return { deleted: res.deletedCount === 1, reason: res.deletedCount ? ("deleted" as const) : ("missing" as const) };
  } catch (err) {
    console.error("[uploads] delete failed", err);
    return { deleted: false, reason: "error" as const };
  }
}

/** After a content save: remove any previously used upload URLs that are no longer referenced. */
export async function releaseReplacedUploads(previous: (string | null | undefined)[], current: (string | null | undefined)[]) {
  const keep = new Set(current.filter(Boolean));
  const dropped = [...new Set(previous.filter((u): u is string => Boolean(u) && !keep.has(u)))];
  for (const url of dropped) await deleteUploadIfUnreferenced(url);
}

/** Deletes unreferenced uploads older than `olderThanHours` (abandoned uploads from cancelled edits). */
export async function cleanupAbandonedUploads(olderThanHours = 24) {
  await connectDb();
  const cutoff = new Date(Date.now() - olderThanHours * 3600 * 1000);
  const referenced = await collectReferencedUploadUrls();
  const candidates = await StoredUpload.find({ createdAt: { $lt: cutoff } }, { folder: 1, filename: 1 }).lean();
  const toDelete = candidates.filter((c) => !referenced.has(uploadUrl(c.folder, c.filename)));
  if (toDelete.length) await StoredUpload.deleteMany({ _id: { $in: toDelete.map((d) => d._id) } });
  return { checked: candidates.length, deleted: toDelete.length };
}

/** Collects every string value of a page document, for diffing image URLs before/after a save. */
export function urlsIn(value: unknown): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      if (v.startsWith("/api/uploads/")) out.push(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(value);
  return out;
}
