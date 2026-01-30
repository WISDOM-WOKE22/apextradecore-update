import type { UserRole } from "@/store/useAppStore";

/** Paths that require admin role. Accessing these as user redirects to /dashboard. */
export const ADMIN_ROUTE_PREFIX = "/admin";

/** Paths that require user role. Accessing these as admin redirects to /admin. */
export const USER_ROUTES = [
  "/dashboard",
  "/deposit",
  "/withdrawal",
  "/investments",
  "/my-investments",
  "/transactions",
  "/settings",
] as const;

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_ROUTE_PREFIX || pathname.startsWith(ADMIN_ROUTE_PREFIX + "/");
}

export function isUserPath(pathname: string): boolean {
  return USER_ROUTES.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export function getDefaultRedirect(role: UserRole): string {
  return role === "admin" ? "/admin" : "/dashboard";
}
