"use server";

import { isValidObjectId } from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/content/queries";
import { connectDb } from "@/lib/db/connect";
import { deleteUploadIfUnreferenced, releaseReplacedUploads } from "@/lib/uploads/store";
import { z } from "zod";
import { DIVISIONS, DIVISION_LABELS } from "@/lib/constants";
import { imageUrl, projectSchema, zodToFieldErrors, type ActionResult } from "@/lib/validation/admin";
import { Project } from "@/models/Project";

function refresh() {
  revalidateTag(TAGS.projects);
  // Project photos appear on the gallery, the homepage and service sections.
  revalidatePath("/", "layout");
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

const bulkSchema = z.object({
  category: z.enum(DIVISIONS),
  serviceKey: z.string().trim().max(80).regex(/^[a-z0-9-]*$/).default(""),
  status: z.enum(["draft", "published"]),
  illustrative: z.boolean(),
  items: z
    .array(z.object({ image: imageUrl.refine((v) => v.startsWith("/api/uploads/"), "Upload the image first."), title: z.string().trim().min(1).max(120) }))
    .min(1)
    .max(50),
});

/** Creates one project per uploaded photo. Titles come from file names and can be edited afterwards. */
export async function createProjectsBulk(input: unknown): Promise<ActionResult<{ created: number }>> {
  return withAdmin(async () => {
    const parsed = bulkSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Some photos could not be added. Please try again." };
    const { category, serviceKey, status, illustrative, items } = parsed.data;
    await connectDb();
    const last = await Project.findOne({}, { order: 1 }).sort({ order: -1 }).lean();
    let order = (last?.order ?? 0) + 1;
    const where = DIVISION_LABELS[category];
    await Project.insertMany(
      items.map((it) => ({
        title: it.title,
        category,
        serviceKey,
        description: "",
        image: it.image,
        imageAlt: `${it.title}, ${where} project in Calgary`,
        illustrative,
        status,
        order: order++,
      })),
    );
    refresh();
    return { ok: true, message: `${items.length} project photo${items.length === 1 ? "" : "s"} added.`, data: { created: items.length } };
  });
}
