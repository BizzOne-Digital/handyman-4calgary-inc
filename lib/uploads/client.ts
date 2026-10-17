import type { UploadFolder } from "@/lib/constants";
import { ALLOWED_MIME, CHUNK_BYTES, DIRECT_UPLOAD_MAX_BYTES, MAX_UPLOAD_BYTES } from "./validate";

export type UploadResponse = { success: true; url: string; filename: string; size: number; folder: UploadFolder };

async function readJson(res: Response) {
  const body = (await res.json().catch(() => null)) as { success?: boolean; error?: string } | null;
  if (!res.ok || !body?.success) {
    throw new Error(body?.error || (res.status === 413 ? "The file is too large." : `Upload failed (${res.status}).`));
  }
  return body;
}

/** Client-side pre-checks mirror the server rules so users get instant feedback. */
export function precheckImage(file: File): string | null {
  if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) return "Choose a PNG, JPEG, WebP or GIF image.";
  if (file.size === 0) return "The file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Images must be 8 MB or smaller.";
  return null;
}

/**
 * Uploads an image to MongoDB storage. Files above ~3.5 MB are sent in 3 MB chunks so they
 * stay under serverless request-body limits; the server reassembles and validates them.
 */
export async function uploadImage(file: File, folder: UploadFolder): Promise<UploadResponse> {
  const problem = precheckImage(file);
  if (problem) throw new Error(problem);

  if (file.size <= DIRECT_UPLOAD_MAX_BYTES) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "same-origin" });
    return (await readJson(res)) as UploadResponse;
  }

  const init = (await readJson(
    await fetch("/api/upload/chunked?step=init", { method: "POST", credentials: "same-origin" }),
  )) as unknown as { uploadId: string };
  const total = Math.ceil(file.size / CHUNK_BYTES);
  for (let i = 0; i < total; i++) {
    const fd = new FormData();
    fd.append("uploadId", init.uploadId);
    fd.append("index", String(i));
    fd.append("chunk", file.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES));
    await readJson(await fetch("/api/upload/chunked?step=part", { method: "POST", body: fd, credentials: "same-origin" }));
  }
  const res = await fetch("/api/upload/chunked?step=complete", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uploadId: init.uploadId, folder, mimeType: file.type, size: file.size, totalChunks: total }),
  });
  return (await readJson(res)) as UploadResponse;
}
