"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProjectsBulk } from "@/app/admin/actions/projects";
import { DIVISIONS, DIVISION_LABELS, type Division } from "@/lib/constants";
import { uploadImage } from "@/lib/uploads/client";
import { Checkbox, Panel, SelectInput } from "./inputs";
import type { ServiceChoice } from "./ProjectForm";

/** "IMG_2041 kitchen-reno.jpg" → "Kitchen reno". Falls back to the service name. */
function titleFrom(name: string, fallback: string) {
  const base = name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\b(img|dsc|pxl|photo|image)[-_ ]?\d+\b/gi, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const t = base.length >= 3 && /[a-z]/i.test(base) ? base : fallback;
  return (t.charAt(0).toUpperCase() + t.slice(1)).slice(0, 120);
}

/**
 * Upload many project photos at once. Each photo becomes its own gallery project
 * (title, category and related service), which can be refined individually afterwards.
 */
export function BulkProjectUpload({ services }: { services: ServiceChoice[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<Division>("residential");
  const [serviceKey, setServiceKey] = useState("");
  const [publish, setPublish] = useState(true);
  const [real, setReal] = useState(true);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const options = services.filter((s) => s.division === category);
  const fallbackTitle = options.find((s) => s.key === serviceKey)?.title ?? `${DIVISION_LABELS[category]} project`;

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])].slice(0, 50);
    e.target.value = "";
    if (!files.length) return;
    setProgress({ done: 0, total: files.length });
    const items: { image: string; title: string }[] = [];
    for (const f of files) {
      try {
        const res = await uploadImage(f, "gallery");
        items.push({ image: res.url, title: titleFrom(f.name, fallbackTitle) });
      } catch (err) {
        toast.error(`${f.name}: ${(err as Error).message}`);
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    if (items.length) {
      const r = await createProjectsBulk({ category, serviceKey, status: publish ? "published" : "draft", illustrative: !real, items });
      if (r.ok) {
        toast.success(r.message);
        router.refresh();
      } else toast.error(r.message);
    }
    setProgress(null);
  };

  return (
    <Panel
      title="Add project photos in bulk"
      description="Select up to 50 photos. Each one becomes a gallery project you can edit later (title, description, alt text)."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectInput
          label="Category"
          value={category}
          onChange={(x) => {
            setCategory(x);
            setServiceKey("");
          }}
          options={DIVISIONS.map((d) => ({ value: d, label: DIVISION_LABELS[d] }))}
        />
        <SelectInput
          label="Related service (optional)"
          value={serviceKey}
          onChange={setServiceKey}
          options={[{ value: "", label: "None" }, ...options.map((s) => ({ value: s.key, label: s.title }))]}
        />
      </div>
      <div className="flex flex-wrap gap-x-8">
        <Checkbox label="Publish immediately" checked={publish} onChange={setPublish} />
        <Checkbox label="These are real client project photos" checked={real} onChange={setReal}
          hint="Untick for stock or example images; they will be labelled “Illustrative example”." />
      </div>
      <div>
        <button
          type="button"
          disabled={Boolean(progress)}
          onClick={() => input.current?.click()}
          className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-ink px-4 text-sm font-semibold text-white hover:bg-graphite disabled:opacity-60"
        >
          {progress ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="h-4 w-4" />}
          {progress ? `Uploading ${progress.done} of ${progress.total}…` : "Choose photos"}
        </button>
        <input
          ref={input}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose project photos"
          onChange={onFiles}
        />
        <p className="mt-2 text-xs text-muted">PNG, JPEG, WebP or GIF, up to 8 MB each.</p>
      </div>
    </Panel>
  );
}
