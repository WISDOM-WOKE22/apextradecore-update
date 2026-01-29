"use client";

import { motion } from "motion/react";
import Link from "next/link";

const TRANSACTIONS = [
  { id: 1, type: "Deposit", amount: "+$2,500.00", date: "2 hours ago", status: "completed", asset: "ETH" },
  { id: 2, type: "Investment", amount: "-$1,200.00", date: "5 hours ago", status: "completed", asset: "Premium" },
  { id: 3, type: "Withdrawal", amount: "-$800.00", date: "Yesterday", status: "completed", asset: "USD" },
  { id: 4, type: "Deposit", amount: "+$5,000.00", date: "2 days ago", status: "completed", asset: "BTC" },
  { id: 5, type: "Reward", amount: "+$124.50", date: "3 days ago", status: "completed", asset: "Staking" },
];

export function LatestTransactions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827]">Latest Transactions</h2>
        <Link
          href="/transactions"
          className="text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
        >
          View all
        </Link>
      </div>
      <ul className="space-y-0 divide-y divide-[#f3f4f6]">
        {TRANSACTIONS.map((tx, i) => {
          const isCredit = tx.amount.startsWith("+");
          return (
            <motion.li
              key={tx.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
              className="flex items-center justify-between py-4 first:pt-0"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isCredit ? "bg-[#d1fae5] text-[#059669]" : "bg-[#fee2e2] text-[#dc2626]"}`}>
                  {isCredit ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#111827]">{tx.type}</p>
                  <p className="text-xs text-text-secondary">{tx.date} · {tx.asset}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${isCredit ? "text-[#059669]" : "text-[#111827]"}`}>
                {tx.amount}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
