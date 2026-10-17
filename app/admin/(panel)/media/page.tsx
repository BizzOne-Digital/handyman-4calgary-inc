import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/constants";
import { connectDb } from "@/lib/db/connect";
import { collectReferencedUploadUrls } from "@/lib/uploads/store";
import { uploadUrl } from "@/lib/uploads/validate";
import { StoredUpload } from "@/models/StoredUpload";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ folder?: string }> }) {
  const { folder } = await searchParams;
  const active = (UPLOAD_FOLDERS as readonly string[]).includes(folder ?? "") ? (folder as UploadFolder) : null;
  await connectDb();
  const [docs, referenced] = await Promise.all([
    // Metadata only; image bytes are never loaded here.
    StoredUpload.find(active ? { folder: active } : {}, { folder: 1, filename: 1, size: 1, mimeType: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(300)
      .lean(),
    collectReferencedUploadUrls(),
  ]);
  const items = docs.map((d) => {
    const url = uploadUrl(d.folder, d.filename);
    return { url, folder: d.folder, filename: d.filename, size: d.size, mimeType: d.mimeType, createdAt: new Date(d.createdAt).toISOString(), inUse: referenced.has(url) };
  });

  return (
    <>
      <AdminHeader title="Media" description="Images stored in MongoDB. Images in use on the website cannot be deleted." />
      <nav aria-label="Folders" className="mb-5 flex flex-wrap gap-2">
        {[null, ...UPLOAD_FOLDERS].map((f) => (
          <Link
            key={f ?? "all"}
            href={f ? `/admin/media?folder=${f}` : "/admin/media"}
            aria-current={active === f ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-[3px] border px-3 text-sm font-medium capitalize ${
              active === f ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
            }`}
          >
            {f ?? "All"}
          </Link>
        ))}
      </nav>
      <MediaLibrary items={items} uploadFolder={active ?? "misc"} />
    </>
  );
}
