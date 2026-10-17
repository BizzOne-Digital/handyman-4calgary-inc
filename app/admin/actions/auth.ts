"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getDummyHash, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { connectDb, isDbConfigured } from "@/lib/db/connect";
import { clientKey, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { AdminUser } from "@/models/AdminUser";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(128),
});

const GENERIC = "Incorrect email or password.";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isDbConfigured()) return { error: "The database is not configured. Set MONGODB_URI and restart." };
  const rawEmail = String(formData.get("email") ?? "").slice(0, 200);
  const parsed = loginSchema.safeParse({ email: rawEmail, password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email address and password.", email: rawEmail };
  const { email, password } = parsed.data;

  try {
    await connectDb();
    const ipKey = `login:ip:${await clientKey()}`;
    const emailKey = `login:email:${email}`;
    const [byIp, byEmail] = await Promise.all([rateLimit(ipKey, 8, 15 * 60), rateLimit(emailKey, 10, 60 * 60)]);
    if (!byIp.allowed || !byEmail.allowed) {
      return { error: "Too many sign-in attempts. Please wait 15 minutes and try again.", email };
    }

    const user = await AdminUser.findOne({ email, active: true }).lean();
    const ok = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
    if (!user || !ok) return { error: GENERIC, email };

    await createSession(String(user._id));
    await AdminUser.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
    await resetRateLimit(emailKey);
  } catch (err) {
    console.error("[login]", err);
    return { error: "Sign-in is temporarily unavailable. Please try again.", email };
  }
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
