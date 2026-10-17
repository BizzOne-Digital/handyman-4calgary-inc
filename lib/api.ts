import "server-only";
import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/auth/csrf";
import { getAdmin, type AdminIdentity } from "@/lib/auth/session";
import { isDbConfigured } from "@/lib/db/connect";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Guards an admin API mutation: database configured, same-origin request, valid session. */
export async function guardAdminMutation(
  req: Request,
): Promise<{ admin: AdminIdentity; error?: never } | { admin?: never; error: NextResponse }> {
  if (!isDbConfigured()) return { error: jsonError("The database is not configured.", 503) };
  if (!isSameOrigin(req)) return { error: jsonError("Cross-site request rejected.", 403) };
  const admin = await getAdmin();
  if (!admin) return { error: jsonError("Authentication required.", 401) };
  return { admin };
}
