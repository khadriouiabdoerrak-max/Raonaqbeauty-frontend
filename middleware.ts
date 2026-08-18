import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Blocage basique des chemins sensibles + pas d’index admin côté bot. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/.env") ||
    pathname.startsWith("/.git") ||
    pathname.includes("wp-admin") ||
    pathname.includes("phpmyadmin")
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const res = NextResponse.next();

  if (pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|videos/|fonts/).*)",
  ],
};
