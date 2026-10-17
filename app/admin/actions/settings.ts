"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/content/queries";
import { connectDb } from "@/lib/db/connect";
import { releaseReplacedUploads } from "@/lib/uploads/store";
import { settingsSchema, zodToFieldErrors, type ActionResult } from "@/lib/validation/admin";
import { SiteSettings } from "@/models/SiteSettings";

export async function saveSettings(input: unknown): Promise<ActionResult> {
  return withAdmin(async () => {
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: zodToFieldErrors(parsed.error) };
    }
    await connectDb();
    const before = await SiteSettings.findOne({ key: "site" }).lean();
    await SiteSettings.updateOne({ key: "site" }, { $set: { ...parsed.data, key: "site" } }, { upsert: true, runValidators: true });
    await releaseReplacedUploads([before?.logoUrl, before?.ogImage], [parsed.data.logoUrl, parsed.data.ogImage]);
    revalidateTag(TAGS.settings);
    revalidatePath("/", "layout");
    return { ok: true, message: "Settings saved. The website has been updated." };
  });
}
