import "server-only";
import bcrypt from "bcryptjs";

const COST = 12;

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, COST);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

let dummyHash: Promise<string> | null = null;
/** Compared against when the email does not exist, so login timing stays similar. */
export function getDummyHash() {
  dummyHash ??= bcrypt.hash("not-a-real-password", COST);
  return dummyHash;
}

export function passwordProblems(pw: string): string | null {
  if (pw.length < 12) return "Password must be at least 12 characters.";
  if (pw.length > 128) return "Password must be 128 characters or fewer.";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return "Password must include letters and numbers.";
  return null;
}
