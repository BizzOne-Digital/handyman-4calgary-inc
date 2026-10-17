import { connectDb, isDbConfigured } from "@/lib/db/connect";
import { toBuffer } from "@/lib/uploads/store";
import { isSafeFilename, isUploadFolder } from "@/lib/uploads/validate";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const notFound = () =>
  new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

/** Public read of a stored image. Filenames are unique per upload, so responses are immutable. */
export async function GET(_req: Request, ctx: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await ctx.params;
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) return notFound();
  if (!isDbConfigured()) return notFound();

  await connectDb();
  const doc = await StoredUpload.findOne({ folder, filename }, { data: 1, mimeType: 1, size: 1 }).lean();
  if (!doc) return notFound();

  const bytes = toBuffer(doc.data);

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
