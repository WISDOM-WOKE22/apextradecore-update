"use client";

import { motion } from "motion/react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  // { href: "/membership-card", label: "Membership Card" },
  { href: "/invest-now", label: "Invest Now" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex list-none gap-8">
        {links.map((link, i) => (
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
