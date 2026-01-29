"use client";

import { motion } from "motion/react";
import Link from "next/link";

const PACKAGES = [
  { name: "Deluxe", invested: 13400, returns: 53600, progress: 100, color: "from-[#6366f1] to-[#8b5cf6]", href: "/my-investments" },
  { name: "Standard", invested: 0, returns: 0, progress: 0, color: "from-[#64748b] to-[#94a3b8]", href: "/invest-now" },
  { name: "Premium", invested: 30700, returns: 122800, progress: 65, color: "from-[#059669] to-[#10b981]", href: "/my-investments" },
  { name: "Gold", invested: 0, returns: 0, progress: 0, color: "from-[#b45309] to-[#f59e0b]", href: "/invest-now" },
];

export function InvestmentPortfolio() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827]">Investment Portfolio</h2>
        <Link
          href="/my-investments"
          className="text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PACKAGES.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="group rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#f3f4f6]`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pkg.progress}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                className={`h-full rounded-full bg-linear-to-r ${pkg.color}`}
              />
            </div>
            <h3 className="text-sm font-semibold text-[#111827]">{pkg.name}</h3>
            <div className="mt-2 space-y-1 text-xs text-text-secondary">
              <p>Invested: <span className="font-medium text-[#111827]">${pkg.invested.toLocaleString()}</span></p>
              <p>Returns: <span className="font-medium text-[#111827]">${pkg.returns.toLocaleString()}</span></p>
            </div>
            <Link
              href={pkg.href}
              className="mt-4 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
            >
              {pkg.progress > 0 ? "View details →" : "Invest now →"}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
