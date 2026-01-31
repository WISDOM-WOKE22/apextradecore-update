"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { navLinks } from "./NavLinks";
import router from "next/router";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, close]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#eee] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-10">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex md:gap-12">
              <NavLinks />
            </div>
            <button
              // variant="accent"
              className="hidden md:flex items-center justify-center rounded-lg px-6 py-3.5 text-base font-medium transition-colors duration-200 bg-[#1e62d4] text-white hover:bg-[#1552b8] focus-visible:ring-2 focus-visible:ring-[#1e62d4] focus-visible:ring-offset-2"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#333] transition-colors hover:bg-[#f0f0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333] focus-visible:ring-offset-2 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              id="mobile-nav-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] md:hidden"
              onClick={close}
              aria-hidden
            />
            <motion.aside
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 z-[70] flex h-full w-[min(320px,85vw)] flex-col border-l border-[#eee] bg-white shadow-xl md:hidden"
            >
              <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#eee] px-6">
                <span className="text-sm font-medium text-[#666]">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#333] transition-colors hover:bg-[#f0f0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333] focus-visible:ring-offset-2"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" aria-hidden />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.03 * i,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block rounded-lg px-4 py-3.5 text-base font-medium text-[#212121] no-underline transition-colors hover:bg-[#f5f5f5] hover:text-[#111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333] focus-visible:ring-inset"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.12, ease: "easeOut" }}
                  className="mt-4 px-4"
                >
                  <Button
                    variant="accent"
                    as="a"
                    href="/dashboard"
                    onClick={close}
                    className="w-full justify-center"
                  >
                    Dashboard
                  </Button>
                </motion.div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
