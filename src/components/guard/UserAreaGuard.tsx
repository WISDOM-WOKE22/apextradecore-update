"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoadUserData } from "@/services/user/loadUserData";
import { useAppStore } from "@/store/useAppStore";
import { getDefaultRedirect } from "@/lib/routes";

/**
 * Wraps user-only routes (dashboard, deposit, withdrawal, etc.).
 * Redirects admins to /admin; redirects unauthenticated to /login.
 */
export function UserAreaGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  useLoadUserData();
  const user = useAppStore((s) => s.user);
  const loading = useAppStore((s) => s.loading);

  useEffect(() => {
    if (loading || !pathname) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "admin") {
      router.replace(getDefaultRedirect("admin"));
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] dark:bg-[#0f0f0f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role === "admin") {
    return null;
  }

  return <>{children}</>;
}
