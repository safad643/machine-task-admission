import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "token";

interface JwtPayload {
  sub?: string;
  role?: string;
  email?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) return false;
  return payload.exp * 1000 < Date.now();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals, static files, and API routes.
    "/((?!_next/static|_next/image|_next/data|api|favicon.ico|.*\\.).*)",
  ],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/public/");

  const isParentRoute = pathname.startsWith("/parent");
  const isAdmissionTeamRoute = pathname.startsWith("/admission-team");
  const isProtectedRoute = isParentRoute || isAdmissionTeamRoute;

  const tokenCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const token = tokenCookie?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role ?? null;
  const isAuthenticated = Boolean(token && payload && !isTokenExpired(payload));

  // Authenticated users should not hang out on auth pages.
  if (isAuthenticated && isPublicRoute && role) {
    const dashboard =
      role === "ADMISSION_TEAM" ? "/admission-team/dashboard" : "/parent/dashboard";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Unauthenticated users trying to access protected routes go to login.
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Enforce role-based route access.
  if (isParentRoute && role !== "PARENT") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdmissionTeamRoute && role !== "ADMISSION_TEAM") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
