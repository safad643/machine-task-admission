import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  routes,
  isPublicRoute,
  isParentRoute,
  isAdmissionTeamRoute,
  getDashboardForRole,
} from "@/lib/routes";

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

  const publicRoute = isPublicRoute(pathname);
  const parentRoute = isParentRoute(pathname);
  const admissionTeamRoute = isAdmissionTeamRoute(pathname);
  const protectedRoute = parentRoute || admissionTeamRoute;

  const tokenCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const token = tokenCookie?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role ?? null;
  const authenticated = Boolean(token && payload && !isTokenExpired(payload));

  // Authenticated users should not hang out on auth pages.
  if (authenticated && publicRoute && role) {
    return NextResponse.redirect(
      new URL(getDashboardForRole(role), request.url)
    );
  }

  // Unauthenticated users trying to access protected routes go to login.
  if (!authenticated && protectedRoute) {
    return NextResponse.redirect(new URL(routes.login, request.url));
  }

  // Enforce role-based route access.
  if (parentRoute && role !== "PARENT") {
    return NextResponse.redirect(new URL(routes.login, request.url));
  }

  if (admissionTeamRoute && role !== "ADMISSION_TEAM") {
    return NextResponse.redirect(new URL(routes.login, request.url));
  }

  return NextResponse.next();
}
