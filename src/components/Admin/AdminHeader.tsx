"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLogoutService } from "@/services/auth/logout";
import { useAppStore, getInitials } from "@/store/useAppStore";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const { logout, loading: logoutLoading } = useLogoutService();
  const user = useAppStore((s) => s.user);
  const reset = useAppStore((s) => s.reset);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.fullName || "Admin";
  const initials = getInitials(displayName);

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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
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
          <h2 className="text-base font-semibold text-[#111827] sm:text-lg">Admin</h2>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-[#f9fafb]"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
              {initials}
            </span>
            <span className="hidden text-[#111827] sm:inline">{displayName}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg">
              <div className="border-b border-[#e5e7eb] px-3 py-2 text-xs text-text-secondary">
                {user?.email}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#111827] hover:bg-[#f9fafb] disabled:opacity-60"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
