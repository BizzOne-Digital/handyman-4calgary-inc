"use server";

import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";
import { withAdmin } from "@/lib/auth/guard";
import { connectDb } from "@/lib/db/connect";
import { enquiryUpdateSchema, type ActionResult } from "@/lib/validation/admin";
import { Enquiry } from "@/models/Enquiry";

export async function updateEnquiry(id: string, input: unknown): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isValidObjectId(id)) return { ok: false, message: "Enquiry not found." };
    const parsed = enquiryUpdateSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Invalid status or notes." };
    await connectDb();
    const res = await Enquiry.updateOne({ _id: id }, { $set: parsed.data });
    if (!res.matchedCount) return { ok: false, message: "Enquiry not found." };
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Enquiry updated." };
  });
}

export async function deleteEnquiry(id: string): Promise<ActionResult> {
  return withAdmin(async () => {
    if (!isValidObjectId(id)) return { ok: false, message: "Enquiry not found." };
    await connectDb();
    const res = await Enquiry.deleteOne({ _id: id });
    if (!res.deletedCount) return { ok: false, message: "Enquiry not found." };
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Enquiry deleted." };
  });
}
