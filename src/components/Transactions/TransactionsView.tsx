"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export type TransactionType = "all" | "deposit" | "withdrawal" | "topup";

interface Transaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Top-up" | "Investment" | "Reward";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  asset: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "Deposit", amount: 2500, date: "2025-01-28T10:30:00", status: "completed", reference: "TXN-7F2A", asset: "ETH" },
  { id: "2", type: "Withdrawal", amount: -800, date: "2025-01-28T09:15:00", status: "completed", reference: "TXN-8B1C", asset: "USD" },
  { id: "3", type: "Top-up", amount: 5000, date: "2025-01-27T14:20:00", status: "completed", reference: "TXN-3D4E", asset: "BTC" },
  { id: "4", type: "Investment", amount: -1200, date: "2025-01-27T11:00:00", status: "completed", reference: "TXN-9E5F", asset: "Premium" },
  { id: "5", type: "Reward", amount: 124.5, date: "2025-01-26T16:45:00", status: "completed", reference: "TXN-1A2B", asset: "Staking" },
  { id: "6", type: "Deposit", amount: 1000, date: "2025-01-26T08:00:00", status: "completed", reference: "TXN-4C5D", asset: "ETH" },
  { id: "7", type: "Withdrawal", amount: -500, date: "2025-01-25T13:30:00", status: "pending", reference: "TXN-6G7H", asset: "USD" },
  { id: "8", type: "Top-up", amount: 3500, date: "2025-01-25T10:00:00", status: "completed", reference: "TXN-2H3I", asset: "USDT" },
  { id: "9", type: "Deposit", amount: 750, date: "2025-01-24T17:20:00", status: "completed", reference: "TXN-5I6J", asset: "SOL" },
  { id: "10", type: "Withdrawal", amount: -1200, date: "2025-01-24T09:45:00", status: "failed", reference: "TXN-8J9K", asset: "USD" },
];

const TABS: { key: TransactionType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdrawal", label: "Withdrawals" },
  { key: "topup", label: "Top-ups" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getTypeFilter(type: TransactionType): (t: Transaction) => boolean {
  if (type === "all") return () => true;
  if (type === "deposit") return (t) => t.type === "Deposit";
  if (type === "withdrawal") return (t) => t.type === "Withdrawal";
  if (type === "topup") return (t) => t.type === "Top-up";
  return () => true;
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const styles = {
    completed: "bg-[#d1fae5] text-[#059669]",
    pending: "bg-[#fef3c7] text-[#b45309]",
    failed: "bg-[#fee2e2] text-[#dc2626]",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

export function TransactionsView() {
  const [activeTab, setActiveTab] = useState<TransactionType>("all");

  const filterFn = getTypeFilter(activeTab);
  const filtered = MOCK_TRANSACTIONS.filter(filterFn);

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Transactions</h1>
        <p className="mt-1 text-sm text-text-secondary">View and filter your transaction history</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-6 flex gap-1 rounded-xl bg-[#f3f4f6] p-1 sm:gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-w-0 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-5 ${
              activeTab === tab.key
                ? "bg-white text-[#111827] shadow-sm"
                : "text-text-secondary hover:text-[#111827]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Type</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Amount</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Date</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Reference</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Asset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-text-secondary sm:px-6">
                      No transactions found for this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx, i) => {
                    const isCredit = tx.amount > 0;
                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.25, delay: i * 0.02 }}
                        className="group transition-colors hover:bg-[#f9fafb]"
                      >
                        <td className="px-4 py-3.5 sm:px-6">
                          <span className="text-sm font-medium text-[#111827]">{tx.type}</span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <span className={`text-sm font-semibold ${isCredit ? "text-[#059669]" : "text-[#111827]"}`}>
                            {isCredit ? "+" : ""}${Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">{formatDate(tx.date)}</td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-text-secondary sm:px-6">{tx.reference}</td>
                        <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">{tx.asset}</td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
