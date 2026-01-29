"use client";

import { motion } from "motion/react";

interface ContactItemProps {
  icon: React.ReactNode;
  label?: string;
  children: React.ReactNode;
  index?: number;
}

export function ContactItem({
  icon,
  children,
  index = 0,
}: ContactItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, delay: 0.1 * index, ease: "easeOut" }}
      className="flex items-start gap-4 text-left"
    >
      <span className="mt-1 shrink-0 text-[#b0b0b0]" aria-hidden>
        {icon}
      </span>
      <span className="text-base leading-relaxed text-text-secondary md:text-lg">
        {children}
      </span>
    </motion.div>
  );
}
