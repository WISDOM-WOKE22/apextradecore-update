"use client";

import { motion } from "motion/react";

export function UserInsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pill-bg text-text-muted">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#212121]">Chris Martin</span>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-[#f5f5f5] hover:text-[#212121]"
          aria-label="Open menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <p className="mb-1 text-lg font-bold text-[#212121]">
        👋 Welcome back, Chris!
      </p>
      <p className="mb-5 text-base text-text-secondary">
        Here is your insight for this week
      </p>

      <div>
        <p className="mb-1 text-sm font-medium text-text-muted">Income</p>
        <div className="flex items-end justify-between gap-4">
          <span className="text-2xl font-bold tracking-tight text-[#212121]">
            $503.00
          </span>
          <span className="flex items-center gap-1.5 text-base font-semibold text-[#00b67a]">
            +4.5% than last week
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden
            >
              <path d="M3 17l6-6 4 4 8-8" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
