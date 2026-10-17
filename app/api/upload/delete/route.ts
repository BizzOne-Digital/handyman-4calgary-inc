import { NextResponse } from "next/server";
import { guardAdminMutation, jsonError } from "@/lib/api";
import { deleteUploadIfUnreferenced } from "@/lib/uploads/store";
import { parseUploadUrl } from "@/lib/uploads/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Deletes a stored upload only when no content document references it. */
export async function POST(req: Request) {
  const guard = await guardAdminMutation(req);
  if (guard.error) return guard.error;

  const body = (await req.json().catch(() => null)) as { url?: unknown } | null;
  const url = body?.url;
  if (!parseUploadUrl(url)) return jsonError("Only stored upload URLs (/api/uploads/...) can be deleted.", 400);

  const result = await deleteUploadIfUnreferenced(url as string);
  if (result.reason === "still-referenced") {
    return jsonError("This image is still used on the website. Remove it from content first.", 409);
  }
  if (result.reason === "missing") return jsonError("Image not found.", 404);
  if (result.reason === "error") return jsonError("The image could not be deleted.", 500);
  return NextResponse.json({ success: true });
}
