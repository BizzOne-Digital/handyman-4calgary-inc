import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { guardAdminMutation, jsonError } from "@/lib/api";
import { UploadError, storeImage, toBuffer } from "@/lib/uploads/store";
import { CHUNK_BYTES, MAX_UPLOAD_BYTES, isAllowedMime, isUploadFolder } from "@/lib/uploads/validate";
import { UploadChunk } from "@/models/UploadChunk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHUNKS = Math.ceil(MAX_UPLOAD_BYTES / CHUNK_BYTES);
const CHUNK_TTL_MS = 60 * 60 * 1000; // abandoned chunks expire after 1 hour
const UPLOAD_ID_RE = /^[a-f0-9]{32}$/;

/**
 * Chunked upload transport for images larger than the host's request-body limit.
 *   ?step=init      -> { uploadId }
 *   ?step=part      FormData { uploadId, index, chunk }
 *   ?step=complete  JSON { uploadId, folder, mimeType, size, totalChunks }
 * The assembled file is validated and stored exactly like /api/upload.
 */
export async function POST(req: Request) {
  const guard = await guardAdminMutation(req);
  if (guard.error) return guard.error;
  const owner = new Types.ObjectId(guard.admin.id);
  const step = new URL(req.url).searchParams.get("step");

  try {
    if (step === "init") {
      return NextResponse.json({ success: true, uploadId: randomBytes(16).toString("hex"), chunkSize: CHUNK_BYTES });
    }

    if (step === "part") {
      const form = await req.formData();
      const uploadId = form.get("uploadId");
      const index = Number(form.get("index"));
      const chunk = form.get("chunk");
      if (typeof uploadId !== "string" || !UPLOAD_ID_RE.test(uploadId)) return jsonError("Invalid upload id.", 400);
      if (!Number.isInteger(index) || index < 0 || index >= MAX_CHUNKS) return jsonError("Invalid chunk index.", 400);
      if (!(chunk instanceof Blob) || chunk.size === 0) return jsonError("Missing chunk data.", 400);
      if (chunk.size > CHUNK_BYTES) return jsonError("Chunk is too large.", 413);
      const data = Buffer.from(await chunk.arrayBuffer());
      // An existing chunk with this id must belong to the same admin.
      const existing = await UploadChunk.findOne({ uploadId }, { owner: 1 }).lean();
      if (existing && !existing.owner.equals(owner)) return jsonError("Upload not found.", 404);
      await UploadChunk.updateOne(
        { uploadId, index },
        { $set: { data, owner, expiresAt: new Date(Date.now() + CHUNK_TTL_MS) } },
        { upsert: true },
      );
      return NextResponse.json({ success: true, index });
    }

    if (step === "complete") {
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      const uploadId = body?.uploadId;
      const folder = body?.folder;
      const mimeType = body?.mimeType;
      const size = Number(body?.size);
      const totalChunks = Number(body?.totalChunks);
      if (typeof uploadId !== "string" || !UPLOAD_ID_RE.test(uploadId)) return jsonError("Invalid upload id.", 400);
      if (!isUploadFolder(folder)) return jsonError("Invalid upload folder.", 400);
      if (!isAllowedMime(mimeType)) return jsonError("Only PNG, JPEG, WebP and GIF images are allowed.", 415);
      if (!Number.isInteger(size) || size <= 0) return jsonError("Invalid file size.", 400);
      if (size > MAX_UPLOAD_BYTES) return jsonError("Images must be 8 MB or smaller.", 413);
      if (!Number.isInteger(totalChunks) || totalChunks < 1 || totalChunks > MAX_CHUNKS) {
        return jsonError("Invalid chunk count.", 400);
      }

      const chunks = await UploadChunk.find({ uploadId, owner }).sort({ index: 1 }).lean();
      try {
        if (chunks.length !== totalChunks || chunks.some((c, i) => c.index !== i)) {
          return jsonError("Some parts of the upload are missing. Please try again.", 400);
        }
        const buffer = Buffer.concat(chunks.map((c) => toBuffer(c.data)));
        if (buffer.length !== size) return jsonError("The uploaded file size does not match.", 400);
        const result = await storeImage({ buffer, declaredMime: mimeType, folder, ownerId: guard.admin.id });
        return NextResponse.json({ success: true, ...result }, { status: 201 });
      } finally {
        await UploadChunk.deleteMany({ uploadId, owner });
      }
    }

    return jsonError("Unknown upload step.", 400);
  } catch (err) {
    if (err instanceof UploadError) return jsonError(err.message, err.status);
    console.error("[upload/chunked]", err);
    return jsonError("The image could not be saved. Please try again.", 500);
  }
}
