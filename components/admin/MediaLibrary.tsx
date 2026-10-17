"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Copy, Loader2, Sparkles, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cleanupMedia, deleteMedia } from "@/app/admin/actions/media";
import { SafeImage } from "@/components/ui/SafeImage";
import type { UploadFolder } from "@/lib/constants";
import { uploadImage } from "@/lib/uploads/client";
import { ConfirmButton } from "./ConfirmButton";

type Item = { url: string; folder: string; filename: string; size: number; mimeType: string; createdAt: string; inUse: boolean };

const fmt = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export function MediaLibrary({ items, uploadFolder }: { items: Item[]; uploadFolder: UploadFolder }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cleaning, startClean] = useTransition();

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    let ok = 0;
    for (const f of files) {
      try {
        await uploadImage(f, uploadFolder);
        ok++;
      } catch (err) {
        toast.error(`${f.name}: ${(err as Error).message}`);
      }
    }
    setUploading(false);
    if (ok) {
      toast.success(`${ok} image${ok === 1 ? "" : "s"} uploaded to “${uploadFolder}”.`);
      router.refresh();
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => input.current?.click()} disabled={uploading}
          className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-ink px-4 text-sm font-semibold text-white hover:bg-graphite disabled:opacity-60">
          {uploading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Upload aria-hidden="true" className="h-4 w-4" />}
          {uploading ? "Uploading…" : `Upload to “${uploadFolder}”`}
        </button>
        <input ref={input} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" tabIndex={-1} aria-label="Choose images to upload" onChange={onFiles} />
        <button
          type="button"
          disabled={cleaning}
          onClick={() =>
            startClean(async () => {
              const r = await cleanupMedia();
              if (r.ok) toast.success(r.message);
              else toast.error(r.message);
              router.refresh();
            })
          }
          className="inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-line bg-white px-4 text-sm font-medium hover:border-ink disabled:opacity-60"
        >
          {cleaning ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Sparkles aria-hidden="true" className="h-4 w-4" />}
          Remove unused (older than 24h)
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[4px] border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold">No images in this folder.</p>
          <p className="mt-1 text-sm text-muted">Uploaded images appear here. Initial content uses selected Unsplash photos, which are not stored here.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {items.map((m) => (
            <li key={m.url} className="overflow-hidden rounded-[4px] border border-line bg-white">
              <div className="relative aspect-square bg-mist">
                <SafeImage src={m.url} alt={m.filename} fill sizes="240px" className="object-cover" />
                <span className={`absolute left-2 top-2 rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold ${m.inUse ? "bg-ink text-white" : "bg-white text-muted"}`}>
                  {m.inUse ? "In use" : "Unused"}
                </span>
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium" title={m.filename}>{m.filename}</p>
                <p className="text-[11px] text-subtle">
                  {m.folder} · {fmt(m.size)} · {new Date(m.createdAt).toLocaleDateString("en-CA")}
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(m.url).then(() => toast.success("Image URL copied."))}
                    aria-label={`Copy URL for ${m.filename}`}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[3px] border border-line text-xs font-medium hover:border-ink"
                  >
                    <Copy aria-hidden="true" className="h-3.5 w-3.5" /> Copy
                  </button>
                  <ConfirmButton
                    title="Delete this image?"
                    description="The image will be permanently removed from storage."
                    disabled={m.inUse}
                    onConfirm={async () => {
                      const r = await deleteMedia(m.url);
                      if (r.ok) {
                        toast.success(r.message);
                        router.refresh();
                      } else toast.error(r.message);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-line text-danger hover:border-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only">{m.inUse ? "Image in use, cannot delete" : `Delete ${m.filename}`}</span>
                  </ConfirmButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
