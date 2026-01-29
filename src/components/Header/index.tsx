"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-[#eee] bg-white"
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="hidden md:flex md:gap-12">
            <NavLinks />
          </div>
          <Button variant="accent" as="a" href="/dashboard">
            Dashboard
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
