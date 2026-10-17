import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/constants";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
/** Requests above this go through chunked transport (Vercel's body limit is ~4.5 MB). */
export const DIRECT_UPLOAD_MAX_BYTES = Math.floor(3.5 * 1024 * 1024);
export const CHUNK_BYTES = 3 * 1024 * 1024;

export const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
export type AllowedMime = (typeof ALLOWED_MIME)[number];

export const MIME_EXT: Record<AllowedMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(v: unknown): v is UploadFolder {
  return typeof v === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(v);
}

export function isAllowedMime(v: unknown): v is AllowedMime {
  return typeof v === "string" && (ALLOWED_MIME as readonly string[]).includes(v);
}

/** Detects the real image type from its file signature (magic bytes). */
export function sniffImageType(buf: Uint8Array): AllowedMime | null {
  if (buf.length < 12) return null;
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  )
    return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  const ascii = (start: number, len: number) => String.fromCharCode(...buf.subarray(start, start + len));
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "image/gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") return "image/webp";
  return null;
}

/** Filenames are always server-generated: `${Date.now()}-${16 hex}.${ext}`. */
const FILENAME_RE = /^[0-9]{10,16}-[a-f0-9]{16}\.(png|jpg|webp|gif)$/;

export function isSafeFilename(name: unknown): name is string {
  return (
    typeof name === "string" &&
    name.length <= 80 &&
    !name.includes("..") &&
    !name.includes("/") &&
    !name.includes("\\") &&
    FILENAME_RE.test(name)
  );
}

export const UPLOAD_URL_PREFIX = "/api/uploads/";

/** Parses `/api/uploads/{folder}/{filename}`. Returns null for anything else (including external URLs). */
export function parseUploadUrl(url: unknown): { folder: UploadFolder; filename: string } | null {
  if (typeof url !== "string" || !url.startsWith(UPLOAD_URL_PREFIX)) return null;
  const rest = url.slice(UPLOAD_URL_PREFIX.length).split("?")[0];
  const parts = rest.split("/");
  if (parts.length !== 2) return null;
  const [folder, filename] = parts;
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) return null;
  return { folder, filename };
}

export function uploadUrl(folder: UploadFolder, filename: string) {
  return `${UPLOAD_URL_PREFIX}${folder}/${filename}`;
}
