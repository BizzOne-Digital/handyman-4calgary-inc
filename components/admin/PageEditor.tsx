"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { discardDraft, savePage, unpublishPage } from "@/app/admin/actions/pages";
import type { PageSlug } from "@/lib/constants";
import type { PageData } from "@/models/PageContent";
import { AdminImageField } from "./AdminImageField";
import { ConfirmButton } from "./ConfirmButton";
import { Panel, StatusBadge, SubmitButton, TextArea, TextInput } from "./inputs";

type Props = {
  slug: PageSlug;
  name: string;
  path: string;
  initial: PageData;
  isPublished: boolean;
  hasChanges: boolean;
  publishedAt: string | null;
  showHeroImage: boolean;
  showIntro: boolean;
};

export function PageEditor({ slug, name, path, initial, isPublished, hasChanges, publishedAt, showHeroImage, showIntro }: Props) {
  const router = useRouter();
  const [data, setData] = useState<PageData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const [mode, setMode] = useState<"draft" | "publish" | null>(null);

  const update = (fn: (d: PageData) => PageData) => {
    setData((d) => fn(structuredClone(d)));
    setDirty(true);
  };
  const setHero = (k: keyof PageData["hero"], v: string) => update((d) => ({ ...d, hero: { ...d.hero, [k]: v } }));

  const save = (m: "draft" | "publish") => {
    setMode(m);
    start(async () => {
      const res = await savePage(slug, data, m);
      if (res.ok) {
        toast.success(res.message);
        setErrors({});
        setDirty(false);
        router.refresh();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.message);
      }
      setMode(null);
    });
  };

  const moveFaq = (i: number, dir: -1 | 1) =>
    update((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.faqs.length) return d;
      [d.faqs[i], d.faqs[j]] = [d.faqs[j], d.faqs[i]];
      return d;
    });

  return (
    <div className="pb-24">
      <Link href="/admin/pages" className="inline-flex min-h-10 items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All pages
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-[1.75rem]">{name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <StatusBadge status={isPublished ? "published" : "draft"} />
            {hasChanges && <StatusBadge status="changes" />}
            {publishedAt && <span>Last published {new Date(publishedAt).toLocaleString("en-CA")}</span>}
            {!isPublished && <span>The live page currently shows the default content.</span>}
          </div>
        </div>
        <a href={path} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line bg-white px-3 text-sm font-medium hover:border-ink">
          View live page <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Panel title="Hero" description="The first section visitors see. Use a line break in the heading to control where it wraps.">
            <TextInput label="Eyebrow" value={data.hero.eyebrow} onChange={(v) => setHero("eyebrow", v)} maxLength={120} error={errors["hero.eyebrow"]} />
            <TextArea label="Heading" required rows={2} value={data.hero.heading} onChange={(v) => setHero("heading", v)} maxLength={160} error={errors["hero.heading"]} />
            <TextArea label="Description" rows={3} value={data.hero.description} onChange={(v) => setHero("description", v)} maxLength={400} error={errors["hero.description"]} />
            {slug !== "home" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Button label" value={data.hero.ctaLabel} onChange={(v) => setHero("ctaLabel", v)} maxLength={40} error={errors["hero.ctaLabel"]} />
                <TextInput label="Button link" value={data.hero.ctaHref} onChange={(v) => setHero("ctaHref", v)} maxLength={200} error={errors["hero.ctaHref"]}
                  hint="Example: /request-a-quote?division=residential" />
              </div>
            )}
            {showHeroImage && (
              <div className="grid gap-4 border-t border-line pt-5">
                <AdminImageField label="Hero image" folder="pages" value={data.hero.image} onChange={(v) => setHero("image", v)} error={errors["hero.image"]} />
                <TextInput label="Hero image alt text" value={data.hero.imageAlt} onChange={(v) => setHero("imageAlt", v)} maxLength={200}
                  hint="Describe what the image shows for screen readers and search engines." error={errors["hero.imageAlt"]} />
              </div>
            )}
          </Panel>

          {showIntro && (
            <Panel title={slug === "home" ? "About preview" : "Introduction"} description="Section heading and body copy. Separate paragraphs with a blank line.">
              <TextArea label="Heading" rows={2} value={data.intro.heading} onChange={(v) => update((d) => ({ ...d, intro: { ...d.intro, heading: v } }))} maxLength={160} error={errors["intro.heading"]} />
              <TextArea label="Body" rows={5} value={data.intro.body} onChange={(v) => update((d) => ({ ...d, intro: { ...d.intro, body: v } }))} maxLength={2000} error={errors["intro.body"]} />
            </Panel>
          )}

          {data.media.length > 0 && (
            <Panel title="Section images" description="Images used in other sections of this page.">
              {data.media.map((m, i) => (
                <div key={m.key} className="grid gap-4 border-b border-line pb-5 last:border-0 last:pb-0">
                  <AdminImageField label={m.label} folder="pages" value={m.url} error={errors[`media.${i}.url`]}
                    onChange={(v) => update((d) => { d.media[i].url = v; return d; })} />
                  <TextInput label={`${m.label}: alt text`} value={m.alt} maxLength={200} error={errors[`media.${i}.alt`]}
                    onChange={(v) => update((d) => { d.media[i].alt = v; return d; })} />
                </div>
              ))}
            </Panel>
          )}

          {!["projects", "request-a-quote", "contact"].includes(slug) && (
            <Panel
              title="FAQs"
              description="Shown near the bottom of the page and included in search structured data."
              actions={
                <button type="button" onClick={() => update((d) => ({ ...d, faqs: [...d.faqs, { question: "", answer: "" }] }))}
                  disabled={data.faqs.length >= 20}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-line px-3 text-sm font-medium hover:border-ink disabled:opacity-50">
                  <Plus aria-hidden="true" className="h-4 w-4" /> Add FAQ
                </button>
              }
            >
              {data.faqs.length === 0 && <p className="text-sm text-muted">No FAQs. The FAQ section is hidden on the page.</p>}
              {data.faqs.map((f, i) => (
                <fieldset key={i} className="rounded-[3px] border border-line p-4">
                  <legend className="px-1 text-xs font-semibold text-muted">FAQ {i + 1}</legend>
                  <div className="space-y-3">
                    <TextInput label="Question" required value={f.question} maxLength={200} error={errors[`faqs.${i}.question`]}
                      onChange={(v) => update((d) => { d.faqs[i].question = v; return d; })} />
                    <TextArea label="Answer" required rows={3} value={f.answer} maxLength={1200} error={errors[`faqs.${i}.answer`]}
                      onChange={(v) => update((d) => { d.faqs[i].answer = v; return d; })} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => moveFaq(i, -1)} disabled={i === 0} aria-label={`Move FAQ ${i + 1} up`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-line disabled:opacity-40"><ArrowUp aria-hidden="true" className="h-4 w-4" /></button>
                    <button type="button" onClick={() => moveFaq(i, 1)} disabled={i === data.faqs.length - 1} aria-label={`Move FAQ ${i + 1} down`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-line disabled:opacity-40"><ArrowDown aria-hidden="true" className="h-4 w-4" /></button>
                    <button type="button" onClick={() => update((d) => ({ ...d, faqs: d.faqs.filter((_, j) => j !== i) }))} aria-label={`Remove FAQ ${i + 1}`}
                      className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-danger hover:border-danger"><Trash2 aria-hidden="true" className="h-4 w-4" /> Remove</button>
                  </div>
                </fieldset>
              ))}
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="SEO" description="Shown in Google results and when the page is shared.">
            <TextInput label="SEO title" value={data.seoTitle} onChange={(v) => update((d) => ({ ...d, seoTitle: v }))} maxLength={70} error={errors.seoTitle}
              hint="Aim for 50–60 characters." />
            <TextArea label="Meta description" rows={4} value={data.seoDescription} onChange={(v) => update((d) => ({ ...d, seoDescription: v }))} maxLength={170}
              error={errors.seoDescription} hint="Aim for 140–160 characters." />
          </Panel>

          {isPublished && (
            <Panel title="Publishing">
              <div className="flex flex-wrap gap-2">
                {hasChanges && (
                  <ConfirmButton
                    title="Discard draft changes?"
                    description="The draft will be reset to the currently published version."
                    confirmLabel="Discard changes"
                    onConfirm={async () => {
                      const r = await discardDraft(slug);
                      if (r.ok) {
                        toast.success(r.message);
                        window.location.reload();
                      } else toast.error(r.message);
                    }}
                    className="inline-flex min-h-10 items-center rounded-[3px] border border-line px-3 text-sm font-medium hover:border-ink"
                  >
                    Discard draft
                  </ConfirmButton>
                )}
                <ConfirmButton
                  title="Unpublish this page?"
                  description="The public page will fall back to the built-in default content until you publish again. Your draft is kept."
                  confirmLabel="Unpublish"
                  onConfirm={async () => {
                    const r = await unpublishPage(slug);
                    if (r.ok) {
                      toast.success(r.message);
                      router.refresh();
                    } else toast.error(r.message);
                  }}
                  className="inline-flex min-h-10 items-center rounded-[3px] border border-line px-3 text-sm font-medium text-danger hover:border-danger"
                >
                  Unpublish
                </ConfirmButton>
              </div>
            </Panel>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur lg:left-64">
        <div className="flex flex-wrap items-center justify-end gap-2 px-4 py-3 sm:px-6 lg:px-10">
          <p className="mr-auto text-sm text-muted" aria-live="polite">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <SubmitButton variant="secondary" pending={pending && mode === "draft"} disabled={pending} onClick={() => save("draft")}>
            Save draft
          </SubmitButton>
          <SubmitButton pending={pending && mode === "publish"} disabled={pending} onClick={() => save("publish")}>
            Save &amp; publish
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
