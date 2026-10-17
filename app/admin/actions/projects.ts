"use server";

import { isValidObjectId } from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/content/queries";
import { connectDb } from "@/lib/db/connect";
import { deleteUploadIfUnreferenced, releaseReplacedUploads } from "@/lib/uploads/store";
import { projectSchema, zodToFieldErrors, type ActionResult } from "@/lib/validation/admin";
import { Project } from "@/models/Project";

function refresh() {
  revalidateTag(TAGS.projects);
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function saveProject(id: string | null, input: unknown): Promise<ActionResult<{ id: string }>> {
  return withAdmin(async () => {
    const parsed = projectSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: zodToFieldErrors(parsed.error) };
    }
    await connectDb();
    if (id) {
      if (!isValidObjectId(id)) return { ok: false, message: "Project not found." };
      const before = await Project.findById(id).lean();
      if (!before) return { ok: false, message: "Project not found." };
      await Project.updateOne({ _id: id }, { $set: parsed.data }, { runValidators: true });
      await releaseReplacedUploads([before.image], [parsed.data.image]);
      refresh();
      return { ok: true, message: "Project saved.", data: { id } };
    }
    const created = await Project.create(parsed.data);
    refresh();
    return { ok: true, message: "Project created.", data: { id: String(created._id) } };
  });
}

export async function deleteProject(id: string): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isValidObjectId(id)) return { ok: false, message: "Project not found." };
    await connectDb();
    const doc = await Project.findByIdAndDelete(id).lean();
    if (!doc) return { ok: false, message: "Project not found." };
    await deleteUploadIfUnreferenced(doc.image);
    refresh();
    return { ok: true, message: "Project deleted." };
  });
}
