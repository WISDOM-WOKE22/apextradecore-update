"use client";

import { motion } from "motion/react";

export function UserWelcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#6366f1] text-lg font-bold text-white shadow-lg">
          RC
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827] sm:text-2xl">
            Welcome back, Ryan
          </h1>
          <p className="text-sm text-text-secondary">
            Here's your investment overview for today
          </p>
        </div>
      </div>
    </motion.div>
  );
}
