"use client";

import { motion } from "motion/react";
import Link from "next/link";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/invest-now", label: "Invest Now" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex list-none gap-8">
        {navLinks.map((link, i) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * i, ease: "easeOut" }}
          >
            <Link
              href={link.href}
              className="text-base font-medium text-[#212121] no-underline transition-colors hover:text-[#1e62d4]"
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
