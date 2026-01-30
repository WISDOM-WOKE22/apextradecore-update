"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { useAppStore } from "@/store/useAppStore";
import { useUserNotifications } from "@/services/notifications/useUserNotifications";
import type { Notification } from "@/services/notifications/types";

function formatDate(createdAt: number): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

function NotificationRow({
  n,
  onSelect,
}: {
  n: Notification;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border border-[#e5e7eb] p-4 text-left transition hover:border-[#d1d5db] hover:bg-[#f9fafb] ${
        !n.read ? "bg-[#eef2ff]/40 border-accent/30" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#111827]">{n.title}</p>
            {!n.read && (
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
            )}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{n.body}</p>
          <p className="mt-2 text-xs text-text-secondary">{formatDate(n.createdAt)}</p>
        </div>
        {n.link && (
          <span className="shrink-0 text-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}

export default function DashboardNotificationsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const { notifications, loading, error, markAsRead } = useUserNotifications(user?.uid ?? null);

  const handleSelect = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    if (n.link) router.push(n.link);
  };

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:ml-[280px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-[#111827]">Notifications</h1>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-accent hover:underline"
              >
                Back to dashboard
              </Link>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-lg border border-[#e5e7eb] bg-white p-12 text-center">
                <p className="text-text-secondary">No notifications yet.</p>
                <p className="mt-1 text-sm text-text-secondary">
                  You’ll see updates here when deposits or withdrawals are approved or rejected, or when plan profits are added.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Go to dashboard
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <NotificationRow n={n} onSelect={() => handleSelect(n)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
