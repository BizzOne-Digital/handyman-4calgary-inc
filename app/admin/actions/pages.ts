"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { PAGE_PATHS, PAGE_SLUGS, type PageSlug } from "@/lib/constants";
import { TAGS } from "@/lib/content/queries";
import { DEFAULT_PAGES } from "@/lib/content/defaults";
import { connectDb } from "@/lib/db/connect";
import { releaseReplacedUploads, urlsIn } from "@/lib/uploads/store";
import { pageDataSchema, zodToFieldErrors, type ActionResult } from "@/lib/validation/admin";
import { PageContent } from "@/models/PageContent";

const isSlug = (v: unknown): v is PageSlug => typeof v === "string" && (PAGE_SLUGS as readonly string[]).includes(v);

function refreshPublic(slug: PageSlug) {
  revalidateTag(TAGS.page(slug));
  revalidatePath(PAGE_PATHS[slug]);
  // The About page reuses Home panel images.
  if (slug === "home") revalidatePath("/about");
}

export async function savePage(slug: unknown, input: unknown, mode: "draft" | "publish"): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isSlug(slug)) return { ok: false, message: "Unknown page." };
    const parsed = pageDataSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: zodToFieldErrors(parsed.error) };
    }
    await connectDb();
    const before = await PageContent.findOne({ slug }).lean();
    const previousUrls = before ? [...urlsIn(before.draft), ...urlsIn(before.published)] : [];

    const update =
      mode === "publish"
        ? { draft: parsed.data, published: parsed.data, hasUnpublishedChanges: false, publishedAt: new Date() }
        : { draft: parsed.data, hasUnpublishedChanges: true };
    const saved = await PageContent.findOneAndUpdate({ slug }, { $set: update }, { upsert: true, new: true, runValidators: true }).lean();

    // Only after a successful save: free images no longer referenced anywhere.
    await releaseReplacedUploads(previousUrls, [...urlsIn(saved?.draft), ...urlsIn(saved?.published)]);
    if (mode === "publish") refreshPublic(slug);
    revalidatePath("/admin/pages");
    return { ok: true, message: mode === "publish" ? "Published. The live page has been updated." : "Draft saved. Publish when you are ready." };
  });
}

/** Removes the live copy so the public page shows the built-in default content. */
export async function unpublishPage(slug: unknown): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isSlug(slug)) return { ok: false, message: "Unknown page." };
    await connectDb();
    const before = await PageContent.findOne({ slug }).lean();
    if (!before?.published) return { ok: false, message: "This page has no published content." };
    await PageContent.updateOne({ slug }, { $set: { published: null, hasUnpublishedChanges: true } });
    await releaseReplacedUploads(urlsIn(before.published), urlsIn(before.draft));
    refreshPublic(slug);
    revalidatePath("/admin/pages");
    return { ok: true, message: "Unpublished. The page now shows the default content." };
  });
}

/** Resets the draft to the currently published version (or the defaults). */
export async function discardDraft(slug: unknown): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isSlug(slug)) return { ok: false, message: "Unknown page." };
    await connectDb();
    const before = await PageContent.findOne({ slug }).lean();
    if (!before) return { ok: false, message: "Nothing to discard." };
    const restored = before.published ?? DEFAULT_PAGES[slug];
    await PageContent.updateOne({ slug }, { $set: { draft: restored, hasUnpublishedChanges: false } });
    await releaseReplacedUploads(urlsIn(before.draft), urlsIn(restored));
    revalidatePath("/admin/pages");
    return { ok: true, message: "Draft changes discarded." };
  });
}
