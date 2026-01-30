"use client";

import { motion } from "motion/react";

export default function AdminTransactionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">All Transactions</h1>
      <p className="mt-1 text-sm text-text-secondary">
        View and manage all user transactions (deposits, withdrawals, investments).
      </p>
      <div className="mt-8 rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm">
        <p className="text-text-secondary">Transaction list and details coming soon.</p>
      </div>
    </motion.div>
  );
}
