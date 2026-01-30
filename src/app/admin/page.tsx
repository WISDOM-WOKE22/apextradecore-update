"use client";

import { motion } from "motion/react";

export default function AdminDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Overview and management for ApexTradeCore.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Users</p>
          <p className="mt-1 text-2xl font-bold text-[#111827]">—</p>
          <a href="/admin/users" className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            Manage users →
          </a>
        </div>
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-[#111827]">—</p>
          <a href="/admin/transactions" className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            View all →
          </a>
        </div>
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Plans</p>
          <p className="mt-1 text-2xl font-bold text-[#111827]">—</p>
          <a href="/admin/plans" className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            Manage plans →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
