import "server-only";
import { isDbConfigured } from "@/lib/db/connect";
import type { ActionResult } from "@/lib/validation/admin";
import { UnauthorizedError, requireAdmin, type AdminIdentity } from "./session";

/**
 * Wraps an admin server action: verifies the session on every call and converts
 * unexpected errors into a safe result. (Next.js already rejects cross-origin action calls.)
 */
export async function withAdmin<T>(fn: (admin: AdminIdentity) => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  if (!isDbConfigured()) return { ok: false, message: "The database is not configured." };
  try {
    const admin = await requireAdmin();
    return await fn(admin);
  } catch (err) {
    if (err instanceof UnauthorizedError) return { ok: false, message: "Your session has expired. Please sign in again." };
    console.error("[admin action]", err);
    return { ok: false, message: "Something went wrong while saving. Please try again." };
  }
}
