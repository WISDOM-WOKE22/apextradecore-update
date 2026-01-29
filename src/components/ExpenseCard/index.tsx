"use client";

import { motion } from "motion/react";

const AMOUNT = "$1,849";
const SPENT = "$738";
const TOTAL = "$2,550";
const PERCENT = 29; // ~738/2550

export function ExpenseCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[280px] rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    >
      <span className="mb-2 inline-block rounded-md bg-[#212121] px-3 py-1.5 text-sm font-medium text-white">
        Daily Expenses Limit
      </span>
      <div className="mb-3 flex items-baseline gap-1.5">
        <span className="text-[1.75rem] font-bold tracking-tight text-[#212121]">
          {AMOUNT}
        </span>
        <span className="text-base text-[#666666]">left</span>
      </div>
      <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-[#eee]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${PERCENT}%` }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-[#5e72e4]"
        />
      </div>
      <p className="text-sm text-[#666666]">
        {SPENT} of {TOTAL} spent
      </p>
    </motion.div>
  );
}
