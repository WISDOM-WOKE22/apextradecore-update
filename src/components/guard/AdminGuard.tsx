"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoadUserData } from "@/services/user/loadUserData";
import { useAppStore } from "@/store/useAppStore";
import { getDefaultRedirect } from "@/lib/routes";

/**
 * Wraps admin-only routes (/admin/*).
 * Redirects non-admins to /dashboard.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useLoadUserData();
  const user = useAppStore((s) => s.user);
  const loading = useAppStore((s) => s.loading);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace(getDefaultRedirect("user"));
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
