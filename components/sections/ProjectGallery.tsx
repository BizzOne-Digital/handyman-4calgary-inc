"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { DIVISION_LABELS, type Division } from "@/lib/constants";
import type { PublicProject } from "@/lib/content/queries";

type Filter = "all" | Division;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial & Industrial" },
];

export function ProjectGallery({ projects }: { projects: PublicProject[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.category === filter)), [projects, filter]);
  const current = openIndex !== null ? visible[openIndex] : null;

  const open = (i: number, el: HTMLElement) => {
    triggerRef.current = el;
    setOpenIndex(i);
  };
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (d: number) => setOpenIndex((i) => (i === null ? i : (i + d + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (openIndex !== null && !dlg.open) dlg.showModal();
    if (openIndex === null && dlg.open) {
      dlg.close();
      triggerRef.current?.focus();
    }
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  return (
    <>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? projects.length : projects.filter((p) => p.category === f.value).length;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-[3px] border px-4 text-sm font-semibold transition-colors ${
                filter === f.value ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
              }`}
            >
              {f.label}
              <span className={`text-xs ${filter === f.value ? "text-white/70" : "text-subtle"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "image" : "images"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-[4px] border border-dashed border-line p-10 text-center text-muted">
          No projects in this category yet.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {visible.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                className="group block w-full text-left"
                aria-label={`View larger image: ${p.title}`}
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[2px] bg-mist">
                  <SafeImage
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-[3px] bg-white/90 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {p.illustrative && (
                    <span className="absolute bottom-3 left-3 rounded-[2px] bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                      Illustrative example
                    </span>
                  )}
                </span>
                <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.14em] text-subtle">{DIVISION_LABELS[p.category]}</span>
                <span className="mt-1 block text-lg font-bold">{p.title}</span>
                {p.description && <span className="mt-1 block text-sm text-muted">{p.description}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === dialogRef.current && close()}
        aria-labelledby="lightbox-title"
        className="m-auto h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/90"
      >
        {current && (
          <div className="on-dark flex h-full flex-col text-white">
            <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
              <p className="text-sm text-white/70">
                {(openIndex ?? 0) + 1} / {visible.length}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-white/30 hover:bg-white hover:text-ink"
                aria-label="Close image viewer"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <SafeImage src={current.image} alt={current.imageAlt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex items-end justify-between gap-4 p-4 sm:p-6">
              <div className="min-w-0">
                <h2 id="lightbox-title" className="text-lg font-bold sm:text-xl">
                  {current.title}
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  {DIVISION_LABELS[current.category]}
                  {current.illustrative && " · Illustrative example, not a completed client project"}
                </p>
              </div>
              {visible.length > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous image"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-white/30 hover:bg-white hover:text-ink">
                    <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next image"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border border-white/30 hover:bg-white hover:text-ink">
                    <ChevronRight aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
