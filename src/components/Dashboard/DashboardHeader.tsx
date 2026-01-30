"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useLogoutService } from "@/services/auth/logout";
import { useAppStore, getInitials } from "@/store/useAppStore";
import { useUserNotifications } from "@/services/notifications/useUserNotifications";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();
  const { logout, loading: logoutLoading } = useLogoutService();
  const user = useAppStore((s) => s.user);
  const reset = useAppStore((s) => s.reset);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { notifications, unreadCount, loading: notificationsLoading, markAsRead } = useUserNotifications(user?.uid ?? null);

  const displayName = user?.fullName || "User";
  const initials = getInitials(displayName);
  const email = user?.email || "";

  const handleLogout = async () => {
    setShowUserMenu(false);
    const result = await logout();
    if (result.success) {
      reset();
      router.push("/login");
      router.refresh();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setShowUserMenu(false);
      if (notificationsRef.current && !notificationsRef.current.contains(target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            {onMenuClick && (
              <button
                type="button"
                onClick={onMenuClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-[#f3f4f6] hover:text-[#111827] lg:hidden"
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <h2 className="text-base font-semibold text-[#111827] sm:text-lg">
              {/* Top Staking Assets */}
            </h2>
          </div>

          <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-accent">
                  {initials}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold truncate max-w-[120px]" title={email}>
                    {email ? `@${email.split("@")[0]}` : "User"}
                  </p>
                  <p className="text-xs text-text-secondary truncate max-w-[120px]">{displayName}</p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-[#e5e7eb] bg-white py-2 shadow-lg"
                >
                  <div>
                    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? "Light" : "Dark"} Theme</button>
                  </div>
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  >
                    Profile
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  >
                    Settings
                  </a>
                  <hr className="my-2 border-[#e5e7eb]" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="block w-full px-4 py-2 text-left text-sm text-[#ef4444] hover:bg-[#f9fafb] disabled:opacity-70"
                  >
                    {logoutLoading ? "Signing out..." : "Sign out"}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative rounded-lg p-2 text-text-secondary hover:bg-[#f9fafb] hover:text-[#111827]"
                aria-label="Notifications"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-[320px] max-h-[400px] overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
                    <h3 className="text-sm font-semibold text-[#111827]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-text-secondary">{unreadCount} unread</span>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-[320px]">
                    {notificationsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-text-secondary">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <NotificationItem
                          key={n.id}
                          notification={n}
                          onSelect={() => {
                            if (!n.read) markAsRead(n.id);
                            setShowNotifications(false);
                            if (n.link) router.push(n.link);
                          }}
                        />
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="border-t border-[#e5e7eb] p-2">
                      <Link
                        href="/dashboard/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="block rounded-lg py-2 text-center text-sm font-medium text-accent hover:bg-[#eef2ff]"
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </header>

      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
}

function formatNotificationDate(createdAt: number): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

function NotificationItem({
  notification,
  onSelect,
}: {
  notification: { id: string; title: string; body: string; read: boolean; createdAt: number; link?: string };
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full px-4 py-3 text-left hover:bg-[#f9fafb] border-b border-[#f3f4f6] last:border-b-0 ${!notification.read ? "bg-[#eef2ff]/50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#111827] truncate">{notification.title}</p>
          <p className="text-xs text-text-secondary line-clamp-2 mt-0.5">{notification.body}</p>
        </div>
        <span className="text-[10px] text-text-secondary shrink-0 whitespace-nowrap">
          {formatNotificationDate(notification.createdAt)}
        </span>
      </div>
      {!notification.read && (
        <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      )}
    </button>
  );
}

function DepositModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("ETH");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#111827]">Deposit Funds</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-secondary hover:bg-[#f9fafb]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Select Asset
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="AVAX">Avalanche (AVAX)</option>
              <option value="MATIC">Polygon (MATIC)</option>
              <option value="SOL">Solana (SOL)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(`Depositing ${amount} ${selectedAsset}...`);
                onClose();
              }}
              className="flex-1 bg-accent text-white hover:bg-[#1552b8]"
            >
              Deposit
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
