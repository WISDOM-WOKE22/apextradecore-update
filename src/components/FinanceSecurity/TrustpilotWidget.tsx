"use client";

import { motion } from "motion/react";

const RATING = 4.5;

export function TrustpilotWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col gap-2"
    >
      <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#00b67a] px-3 py-1.5 text-base font-medium text-white">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Trustpilot
      </span>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={i <= Math.floor(RATING) ? "#00b67a" : "rgba(255,255,255,0.4)"}
              className="shrink-0"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-lg font-semibold text-white">{RATING}</span>
      </div>
    </motion.div>
  );
}
