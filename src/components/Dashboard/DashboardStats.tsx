"use client";

import { motion } from "motion/react";
import { useAppStore, formatCurrency } from "@/store/useAppStore";

const STATS_CONFIG = [
  {
    key: "accountBalance" as const,
    label: "Total Account Balance",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: "totalInvested" as const,
    label: "Total Invested",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
  {
    key: "totalDeposits" as const,
    label: "Total Deposits",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    key: "totalWithdrawals" as const,
    label: "Total Withdrawals",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

export function DashboardStats() {
  const accountBalance = useAppStore((s) => s.accountBalance);
  const totalDeposits = useAppStore((s) => s.totalDeposits);
  const totalWithdrawals = useAppStore((s) => s.totalWithdrawals);
  const totalInvested = useAppStore((s) => s.totalInvested);
  const loading = useAppStore((s) => s.loading);

  const values = {
    accountBalance,
    totalInvested,
    totalDeposits,
    totalWithdrawals,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS_CONFIG.map(({ key, label, icon }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2 }}
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">{label}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef2ff] text-accent">
              {icon}
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            {loading ? "—" : formatCurrency(values[key])}
          </p>
          <p className="mt-1 text-sm font-medium text-text-secondary">
            From your account
          </p>
        </motion.div>
      ))}
    </div>
  );
}
