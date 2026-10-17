"use server";

import { isValidObjectId } from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/content/queries";
import { connectDb } from "@/lib/db/connect";
import { deleteUploadIfUnreferenced, releaseReplacedUploads } from "@/lib/uploads/store";
import { serviceSchema, zodToFieldErrors, type ActionResult } from "@/lib/validation/admin";
import { Service } from "@/models/Service";

function refresh() {
  revalidateTag(TAGS.services);
  for (const p of ["/", "/residential", "/commercial-industrial", "/admin/services"]) revalidatePath(p);
}

export async function saveService(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return withAdmin(async () => {
    const parsed = serviceSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: zodToFieldErrors(parsed.error) };
    }
    await connectDb();
    const clash = await Service.findOne({ key: parsed.data.key, ...(id ? { _id: { $ne: id } } : {}) }, { _id: 1 }).lean();
    if (clash) return { ok: false, message: "Another service already uses this key.", fieldErrors: { key: "Key must be unique." } };

    if (id) {
      if (!isValidObjectId(id)) return { ok: false, message: "Service not found." };
      const before = await Service.findById(id).lean();
      if (!before) return { ok: false, message: "Service not found." };
      await Service.updateOne({ _id: id }, { $set: parsed.data }, { runValidators: true });
      await releaseReplacedUploads([before.image], [parsed.data.image]);
      refresh();
      return { ok: true, message: "Service saved.", data: { id } };
    }
    const created = await Service.create(parsed.data);
    refresh();
    return { ok: true, message: "Service created.", data: { id: String(created._id) } };
  });
}

export async function deleteService(id: string): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isValidObjectId(id)) return { ok: false, message: "Service not found." };
    await connectDb();
    const doc = await Service.findByIdAndDelete(id).lean();
    if (!doc) return { ok: false, message: "Service not found." };
    await deleteUploadIfUnreferenced(doc.image);
    refresh();
    return { ok: true, message: "Service deleted." };
  });
}
