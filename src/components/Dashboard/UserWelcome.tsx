"use client";

import { motion } from "motion/react";
import { useAppStore, getInitials } from "@/store/useAppStore";

export function UserWelcome() {
  const user = useAppStore((s) => s.user);
  const loading = useAppStore((s) => s.loading);

  const displayName = user?.fullName || "User";
  const initials = getInitials(displayName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#6366f1] text-lg font-bold text-white shadow-lg">
          {loading ? "…" : initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-2xl">
            {loading ? "Loading…" : `Welcome back, ${displayName.split(" ")[0] || displayName}`}
          </h1>
          <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">
            Here&apos;s your investment overview for today
          </p>
        </div>
      </div>
    </motion.div>
  );
}
