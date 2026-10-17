import { NextResponse } from "next/server";
import { guardAdminMutation, jsonError } from "@/lib/api";
import { UploadError, storeImage } from "@/lib/uploads/store";
import { DIRECT_UPLOAD_MAX_BYTES, MAX_UPLOAD_BYTES, isUploadFolder } from "@/lib/uploads/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Direct multipart upload for normal-size images.
 * Larger files (up to 8 MB) use /api/upload/chunked because serverless hosts such as
 * Vercel cap request bodies at ~4.5 MB.
 */
export async function POST(req: Request) {
  const guard = await guardAdminMutation(req);
  if (guard.error) return guard.error;

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_UPLOAD_BYTES + 64 * 1024) return jsonError("Images must be 8 MB or smaller.", 413);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Expected multipart form data.", 400);
  }

  const folder = form.get("folder");
  const file = form.get("file");
  if (!isUploadFolder(folder)) return jsonError("Invalid upload folder.", 400);
  if (!(file instanceof File)) return jsonError("No file was provided.", 400);
  if (file.size === 0) return jsonError("The file is empty.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return jsonError("Images must be 8 MB or smaller.", 413);
  if (file.size > DIRECT_UPLOAD_MAX_BYTES && process.env.VERCEL) {
    return jsonError("This file is too large for a direct upload. Use the chunked upload endpoint.", 413);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await storeImage({ buffer, declaredMime: file.type, folder, ownerId: guard.admin.id });
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) return jsonError(err.message, err.status);
    console.error("[upload]", err);
    return jsonError("The image could not be saved. Please try again.", 500);
  }
}
