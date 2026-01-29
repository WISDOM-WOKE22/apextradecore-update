"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href="/" className="flex items-center gap-2 no-underline">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#cc0000] text-lg font-bold text-white"
          aria-hidden
        >
          T
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[17px] font-bold tracking-tight text-[#212121]">
            TESLA
          </span>
          <span className="text-[12px] font-normal text-[#666666]">
            Share Hub Investment
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
