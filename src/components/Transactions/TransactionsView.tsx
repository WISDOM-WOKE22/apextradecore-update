"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useUserTransactions } from "@/services/transactions/useUserTransactions";
import type { TransactionFilter } from "@/services/transactions/useUserTransactions";
import type { TransactionKind } from "@/services/transactions/types";
import type { UnifiedTransaction } from "@/services/transactions/types";

const PAGE_SIZE = 10;

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
    completed: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    approved: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    active: "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e3a8a] dark:text-[#93c5fd]",
    pending: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f] dark:text-[#fcd34d]",
    failed: "bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]",
    rejected: "bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]",
  };
  const style = styles[normalized] ?? "bg-[#f3f4f6] text-[#6b7280] dark:bg-[#404040] dark:text-[#a3a3a3]";
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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageIndex = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedTransactions = useMemo(() => {
    const start = (pageIndex - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageIndex]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  }, [totalPages]);

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
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">Transactions</h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">View and filter your transaction history</p>
        </div>
        <button
          type="button"
          onClick={handleRefetch}
          disabled={loading || refreshing}
          className="self-start rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 flex gap-1 rounded-xl bg-[#f3f4f6] p-1 dark:bg-[#262626] sm:gap-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setFilter(tab.key);
              setCurrentPage(1);
            }}
            className={`min-w-0 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-5 ${
              filter === tab.key
                ? "bg-white text-[#111827] shadow-sm dark:bg-[#1a1a1a] dark:text-[#f5f5f5]"
                : "text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
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
        className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
      >
        {error && (
          <div className="border-b border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]" role="alert">
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
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading transactions…</p>
          </div>
        ) : (
          <div className="table-scroll-wrap -mx-2 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#262626]">
                  <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Type</th>
                  <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Amount</th>
                  <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Date</th>
                  <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Status</th>
                  <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Reference</th>
                  <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Asset</th>
                  <th className="whitespace-nowrap px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-12 text-center sm:px-4 sm:py-12 lg:px-6">
                        <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">No transactions found for this filter.</p>
                        <p className="mt-1 text-xs text-text-secondary dark:text-[#737373]">Deposits, withdrawals, investments, and profits will appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((tx: UnifiedTransaction, i: number) => (
                      <motion.tr
                        key={`${tx.kind}-${tx.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.25, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                        className="group transition-colors hover:bg-[#f9fafb] dark:hover:bg-[#262626]"
                      >
                        <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                          <span className="text-sm font-medium text-[#111827] dark:text-[#f5f5f5]">
                            {txTypeLabel(tx.kind)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                          <span
                            className={`text-sm font-semibold ${
                              tx.kind === "deposit" || tx.kind === "profit" ? "text-[#059669] dark:text-[#34d399]" : "text-[#111827] dark:text-[#f5f5f5]"
                            }`}
                          >
                            {formatAmount(tx.amount, tx.kind)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4 sm:py-3.5 lg:px-6">
                          {formatDate(tx.dateSortKey)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-text-secondary dark:text-[#a3a3a3] sm:px-4 sm:py-3.5 lg:px-6">
                          {tx.reference}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4 sm:py-3.5 lg:px-6">{tx.asset}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">
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

        {!loading && filtered.length > 0 && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] bg-[#f9fafb] px-3 py-3 dark:border-[#2a2a2a] dark:bg-[#262626] sm:px-4 lg:px-6">
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">
              Showing {(pageIndex - 1) * PAGE_SIZE + 1}–{Math.min(pageIndex * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goToPage(pageIndex - 1)}
                disabled={pageIndex <= 1}
                className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] disabled:pointer-events-none disabled:opacity-50 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - pageIndex) <= 1) return true;
                  return false;
                })
                .reduce<number[]>((acc, p, i, arr) => {
                  const prev = arr[i - 1];
                  if (prev !== undefined && p - prev > 1) acc.push(-1);
                  acc.push(p);
                  return acc;
                }, [])
                .map((p) =>
                  p === -1 ? (
                    <span key="ellipsis" className="px-1 text-text-secondary dark:text-[#a3a3a3]">…</span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        p === pageIndex
                          ? "bg-accent text-white"
                          : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f3f4f6] dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                type="button"
                onClick={() => goToPage(pageIndex + 1)}
                disabled={pageIndex >= totalPages}
                className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] disabled:pointer-events-none disabled:opacity-50 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
