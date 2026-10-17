import "server-only";
import { cache } from "react";
import { createHash, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDb, isDbConfigured } from "@/lib/db/connect";
import { AdminSession } from "@/models/AdminSession";
import { AdminUser } from "@/models/AdminUser";

const isProd = process.env.NODE_ENV === "production";
/** `__Host-` prefix requires Secure, Path=/ and no Domain, so it is only used in production. */
export const SESSION_COOKIE = isProd ? "__Host-h4c_admin" : "h4c_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export type AdminIdentity = { id: string; email: string; name: string };

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  await connectDb();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const ua = (await headers()).get("user-agent")?.slice(0, 300);
  await AdminSession.create({ tokenHash: hashToken(token), user: userId, expiresAt, userAgent: ua });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Validates the session cookie against the database. Memoised per request. */
export const getAdmin = cache(async (): Promise<AdminIdentity | null> => {
  if (!isDbConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  await connectDb();
  const session = await AdminSession.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean();
  if (!session) return null;
  const user = await AdminUser.findOne({ _id: session.user, active: true }, { email: 1, name: 1 }).lean();
  if (!user) return null;
  return { id: String(user._id), email: user.email, name: user.name };
});

/** For admin pages: redirect to login when not authenticated. */
export async function requireAdminPage(): Promise<AdminIdentity> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

/** For server actions and API routes: throw when not authenticated. */
export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token && isDbConfigured()) {
    await connectDb();
    await AdminSession.deleteOne({ tokenHash: hashToken(token) });
  }
  jar.delete(SESSION_COOKIE);
}
