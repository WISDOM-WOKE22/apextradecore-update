"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { useUserTransactions } from "@/services/transactions/useUserTransactions";
import type { TransactionFilter } from "@/services/transactions/useUserTransactions";
import type { TransactionKind } from "@/services/transactions/types";
import type { UnifiedTransaction } from "@/services/transactions/types";

const TABS: { key: TransactionFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdrawal", label: "Withdrawals" },
  { key: "investment", label: "Investments" },
  { key: "profit", label: "Profits" },
];

function formatDate(dateSortKey: number): string {
  if (!dateSortKey || dateSortKey <= 0) return "—";
  return new Date(dateSortKey).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAmount(amount: string, kind: TransactionKind): string {
  const num = parseFloat(amount) || 0;
  const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return kind === "deposit" || kind === "profit" ? `+$${formatted}` : `−$${formatted}`;
}

function txTypeLabel(kind: TransactionKind): string {
  return kind === "deposit" ? "Deposit" : kind === "withdrawal" ? "Withdrawal" : kind === "profit" ? "Profit" : "Investment";
}

function txDetailHref(tx: UnifiedTransaction): string {
  if (tx.kind === "investment") return `/my-investments/${encodeURIComponent(tx.id)}`;
  if (tx.kind === "profit") return `/my-investments/${encodeURIComponent(tx.reference)}`;
  return `/dashboard/transactions/${tx.kind}/${encodeURIComponent(tx.id)}`;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const styles: Record<string, string> = {
    completed: "bg-[#d1fae5] text-[#059669]",
    approved: "bg-[#d1fae5] text-[#059669]",
    active: "bg-[#dbeafe] text-[#1d4ed8]",
    pending: "bg-[#fef3c7] text-[#b45309]",
    failed: "bg-[#fee2e2] text-[#dc2626]",
    rejected: "bg-[#fee2e2] text-[#dc2626]",
  };
  const style = styles[normalized] ?? "bg-[#f3f4f6] text-[#6b7280]";
  const label = normalized === "approved" ? "Approved" : status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}

export function TransactionsView() {
  const { loading, error, refetch, filtered, filter, setFilter } = useUserTransactions();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefetch = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Transactions</h1>
          <p className="mt-1 text-sm text-text-secondary">View and filter your transaction history</p>
        </div>
        <button
          type="button"
          onClick={handleRefetch}
          disabled={loading || refreshing}
          className="self-start rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex gap-1 rounded-xl bg-[#f3f4f6] p-1 sm:gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`min-w-0 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-5 ${
              filter === tab.key
                ? "bg-white text-[#111827] shadow-sm"
                : "text-text-secondary hover:text-[#111827]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
      >
        {error && (
          <div className="border-b border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]" role="alert">
            {error}
            <button
              type="button"
              onClick={handleRefetch}
              className="ml-2 font-medium underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading transactions…</p>
          </div>
        ) : (
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
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center sm:px-6">
                        <p className="text-sm text-text-secondary">No transactions found for this filter.</p>
                        <p className="mt-1 text-xs text-text-secondary">Deposits, withdrawals, investments, and profits will appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((tx: UnifiedTransaction, i: number) => (
                      <motion.tr
                        key={`${tx.kind}-${tx.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.25, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                        className="group transition-colors hover:bg-[#f9fafb]"
                      >
                        <td className="px-4 py-3.5 sm:px-6">
                          <span className="text-sm font-medium text-[#111827]">
                            {txTypeLabel(tx.kind)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <span
                            className={`text-sm font-semibold ${
                              tx.kind === "deposit" || tx.kind === "profit" ? "text-[#059669]" : "text-[#111827]"
                            }`}
                          >
                            {formatAmount(tx.amount, tx.kind)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">
                          {formatDate(tx.dateSortKey)}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-text-secondary sm:px-6">
                          {tx.reference}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">{tx.asset}</td>
                        <td className="px-4 py-3.5 text-right sm:px-6">
                          <Link
                            href={txDetailHref(tx)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-[#1552b8]"
                          >
                            View
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
