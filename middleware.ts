import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic redirect for admin pages without a session cookie.
 * Real authentication happens server-side in the admin layout, server actions and API routes.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const hasCookie = req.cookies.has("__Host-h4c_admin") || req.cookies.has("h4c_admin");
  if (!hasCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
