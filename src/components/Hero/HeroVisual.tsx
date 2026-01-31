"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ExpenseCard } from "@/components/ExpenseCard";
import image from "@/assets/personal.webp";

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[420px] flex-1 items-end justify-center overflow-hidden rounded-2xl md:min-h-[720px]"
    >
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative h-[380px] w-full max-w-[420px] md:h-[800px] md:max-w-[480px]">
          <Image
            src={image.src}
            alt="Professional investor"
            fill
            // sizes="(max-width: 768px) 620px, 680px"
            className="object-contain object-bottom grayscale"
            priority
          />
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 md:bottom-12 md:left-[35%] md:translate-x-0">
        <ExpenseCard />
      </div>
    </motion.div>
  );
}
