"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/ui/SafeImage";
import type { UploadFolder } from "@/lib/constants";
import { precheckImage, uploadImage } from "@/lib/uploads/client";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  hint?: string;
  error?: string;
  aspect?: string;
  required?: boolean;
};

/**
 * Upload / replace / remove an image. Only the returned URL is passed to onChange; the previous
 * image is never deleted here. The server frees it after the content document is saved.
 */
export function AdminImageField({ label, value, onChange, folder, hint, error, aspect = "aspect-[16/10]", required }: Props) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = () => !busy && input.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = precheckImage(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    try {
      const res = await uploadImage(file, folder);
      onChange(res.url);
      toast.success("Image uploaded. Save to apply it to the website.");
    } catch (err) {
      toast.error((err as Error).message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-[13px] font-semibold text-ink">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className={`relative w-full overflow-hidden rounded-[3px] border border-line bg-mist sm:w-56 ${aspect}`}>
          {value ? (
            <SafeImage src={value} alt="" fill sizes="224px" className="object-cover" />
          ) : (
            <button
              type="button"
              onClick={pick}
              disabled={busy}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-sm text-muted hover:text-ink"
              aria-describedby={`${id}-label`}
            >
              <ImagePlus aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
              No image
            </button>
          )}
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80" role="status">
              <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin" />
              <span className="sr-only">Uploading…</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={pick}
            disabled={busy}
            aria-describedby={`${id}-label`}
            className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line bg-white px-3 text-sm font-medium hover:border-ink disabled:opacity-50"
          >
            {value ? <RefreshCw aria-hidden="true" className="h-4 w-4" /> : <ImagePlus aria-hidden="true" className="h-4 w-4" />}
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={busy}
              aria-describedby={`${id}-label`}
              className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line bg-white px-3 text-sm font-medium text-danger hover:border-danger disabled:opacity-50"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" /> Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        aria-labelledby={`${id}-label`}
        onChange={onFile}
      />
      {value && <p className="mt-1.5 break-all text-[11px] text-subtle">{value}</p>}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
