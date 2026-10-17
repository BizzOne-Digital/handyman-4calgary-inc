"use server";

import { revalidatePath } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { cleanupAbandonedUploads, deleteUploadIfUnreferenced } from "@/lib/uploads/store";
import { parseUploadUrl } from "@/lib/uploads/validate";
import type { ActionResult } from "@/lib/validation/admin";

export async function deleteMedia(url: string): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!parseUploadUrl(url)) return { ok: false, message: "Only stored uploads can be deleted." };
    const res = await deleteUploadIfUnreferenced(url);
    if (res.reason === "still-referenced") {
      return { ok: false, message: "This image is still used on the website. Replace or remove it in the content first." };
    }
    if (!res.deleted) return { ok: false, message: "The image could not be deleted." };
    revalidatePath("/admin/media");
    return { ok: true, message: "Image deleted." };
  });
}

export async function cleanupMedia(): Promise<ActionResult<{ deleted: number }>> {
  return withAdmin(async () => {
    const res = await cleanupAbandonedUploads(24);
    revalidatePath("/admin/media");
    return {
      ok: true,
      message: res.deleted ? `Removed ${res.deleted} unused image${res.deleted === 1 ? "" : "s"}.` : "No unused images older than 24 hours.",
      data: { deleted: res.deleted },
    };
  });
}
