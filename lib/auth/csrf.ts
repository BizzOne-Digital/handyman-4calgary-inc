import "server-only";

/**
 * CSRF protection for cookie-authenticated API routes.
 * Server Actions get the same Origin/Host check from Next.js automatically.
 * Requests must carry an Origin (or Referer) header matching the host serving the app.
 */
export function isSameOrigin(req: Request): boolean {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return false;
  const source = req.headers.get("origin") ?? req.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}
