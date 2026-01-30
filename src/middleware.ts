import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("firebase-token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((path) => pathname.startsWith(path));
  const isAuthRoute = AUTH_ROUTES.some((path) => pathname === path || pathname.startsWith(path + "/"));

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login", "/register"],
};
