/**
 * Creates an admin user, or resets an existing admin's password.
 *
 *   ADMIN_EMAIL=owner@example.com ADMIN_NAME="Owner" ADMIN_PASSWORD='a-long-password-123' npm run admin:create
 *   npm run admin:create -- --email owner@example.com --name "Owner" --password 'a-long-password-123'
 *   add --reset to change the password of an existing account (signs out all its sessions)
 *
 * Credentials are never stored in the codebase. Prefer environment variables over arguments
 * so the password does not end up in your shell history.
 */
import "./env";
import mongoose from "mongoose";
import { hashPassword, passwordProblems } from "@/lib/auth/password";
import { connectDb } from "@/lib/db/connect";
import { AdminSession } from "@/models/AdminSession";
import { AdminUser } from "@/models/AdminUser";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = (arg("email") ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const name = (arg("name") ?? process.env.ADMIN_NAME ?? "Administrator").trim();
  const password = arg("password") ?? process.env.ADMIN_PASSWORD ?? "";
  const reset = process.argv.includes("--reset");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Provide a valid --email or ADMIN_EMAIL.");
  const problem = passwordProblems(password);
  if (problem) throw new Error(problem);

  await connectDb();
  await AdminUser.syncIndexes();
  const existing = await AdminUser.findOne({ email });
  const passwordHash = await hashPassword(password);

  if (existing) {
    if (!reset) throw new Error(`An admin with ${email} already exists. Add --reset to change its password.`);
    existing.passwordHash = passwordHash;
    existing.active = true;
    await existing.save();
    await AdminSession.deleteMany({ user: existing._id });
    console.log(`Password reset for ${email}. Existing sessions were signed out.`);
  } else {
    await AdminUser.create({ email, name, passwordHash });
    console.log(`Admin created: ${email}`);
  }
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(`Error: ${(err as Error).message}`);
  await mongoose.disconnect();
  process.exit(1);
});
