import { NextRequest, NextResponse } from "next/server";

const USER_PROTECTED = [
  "/dashboard",
  "/deposit",
  "/withdrawal",
  "/investments",
  "/my-investments",
  "/transactions",
  "/settings",
];
const ADMIN_PROTECTED = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

function isProtected(pathname: string): boolean {
  return (
    USER_PROTECTED.some((path) => pathname === path || pathname.startsWith(path + "/")) ||
    ADMIN_PROTECTED.some((path) => pathname === path || pathname.startsWith(path + "/"))
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("firebase-token")?.value;
  const pathname = req.nextUrl.pathname;

  if (isAuthRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtected(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/deposit",
    "/deposit/:path*",
    "/withdrawal",
    "/withdrawal/:path*",
    "/investments",
    "/investments/:path*",
    "/my-investments",
    "/my-investments/:path*",
    "/transactions",
    "/transactions/:path*",
    "/settings",
    "/settings/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
