"use client";

import { motion } from "motion/react";
import { HeroContent } from "./HeroContent";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-[#f8f8f8]"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-24 lg:px-10">
        <div className="flex items-center">
          <HeroContent />
        </div>
        <div className="flex items-end">
          <HeroVisual />
        </div>
      </div>
    </motion.section>
  );
}
