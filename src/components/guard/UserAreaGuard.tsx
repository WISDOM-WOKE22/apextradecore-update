"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoadUserData } from "@/services/user/loadUserData";
import { useAppStore } from "@/store/useAppStore";
import { getDefaultRedirect } from "@/lib/routes";

/**
 * Wraps user-only routes (dashboard, deposit, withdrawal, etc.).
 * Redirects suspended users to /account-blocked; admins to /admin; unauthenticated to /login.
 * Uses client-side navigation (no full page reload).
 */
export function UserAreaGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  useLoadUserData();
  const user = useAppStore((s) => s.user);
  const loading = useAppStore((s) => s.loading);
  const suspendedMessage = useAppStore((s) => s.suspendedMessage);

  useEffect(() => {
    if (loading || !pathname) return;
    if (!user) {
      if (suspendedMessage) {
        router.replace("/account-blocked");
      } else {
        router.replace("/login");
      }
      return;
    }
    if (user.role === "admin") {
      router.replace(getDefaultRedirect("admin"));
    }
  }, [user, loading, pathname, suspendedMessage, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] dark:bg-[#0f0f0f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role === "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f9fafb] dark:bg-[#0f0f0f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">
          {suspendedMessage ? "Taking you to account blocked…" : "Redirecting to login…"}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
