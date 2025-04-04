import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/api/auth"];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if path is a public asset
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/placeholder") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get user session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if not authenticated
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Admin-only paths
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    // Redirect non-admin users to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip api routes except admin endpoints
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};