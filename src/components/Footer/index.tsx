"use client";

import { motion } from "motion/react";
import { FooterLogo } from "./FooterLogo";
import { FooterNav } from "./FooterNav";
import { FooterBottom } from "./FooterBottom";

const FOOTER_BG = "#1A202C";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
      style={{ backgroundColor: FOOTER_BG }}
    >
      <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-16">
          <FooterLogo />
          <FooterNav />
        </div>
        <FooterBottom />
      </div>
    </motion.footer>
  );
}
