"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import type { UnifiedTransaction, TransactionKind } from "@/services/transactions/types";
import type { FetchUserTransactionsResult } from "@/services/transactions/fetchUserTransactions";

const LATEST_COUNT = 4;

interface LatestTransactionsProps {
  data: FetchUserTransactionsResult | null;
  loading: boolean;
  error: string | null;
}

function formatRelativeDate(dateSortKey: number): string {
  if (!dateSortKey || dateSortKey <= 0) return "—";
  const now = Date.now();
  const diffMs = now - dateSortKey;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateSortKey).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAmount(amount: string, kind: TransactionKind): string {
  const num = parseFloat(amount) || 0;
  const formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return kind === "deposit" || kind === "profit" ? `+$${formatted}` : `-$${formatted}`;
}

function txLabel(kind: TransactionKind): string {
  return kind === "deposit" ? "Deposit" : kind === "withdrawal" ? "Withdrawal" : kind === "profit" ? "Profit" : "Investment";
}

function txHref(tx: UnifiedTransaction): string {
  if (tx.kind === "investment") return `/my-investments/${encodeURIComponent(tx.id)}`;
  if (tx.kind === "profit") return `/my-investments/${encodeURIComponent(tx.reference)}`;
  return `/dashboard/transactions/${tx.kind}/${encodeURIComponent(tx.id)}`;
}

export function LatestTransactions({ data, loading, error }: LatestTransactionsProps) {
  const latest = (data?.all ?? []).slice(0, LATEST_COUNT);

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
          href="/dashboard/transactions"
          className="text-sm font-semibold text-accent no-underline transition-colors hover:text-[#1552b8]"
        >
          View all
        </Link>
      </div>

      {error && (
        <p className="py-4 text-sm text-[#b91c1c]">{error}</p>
      )}

      {loading ? (
        <ul className="space-y-0 divide-y divide-[#f3f4f6]">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#f3f4f6]" />
                <div className="space-y-1">
                  <div className="h-4 w-20 animate-pulse rounded bg-[#f3f4f6]" />
                  <div className="h-3 w-16 animate-pulse rounded bg-[#f3f4f6]" />
                </div>
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-[#f3f4f6]" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-0 divide-y divide-[#f3f4f6]">
          <AnimatePresence mode="popLayout">
            {latest.length === 0 ? (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center text-sm text-text-secondary"
              >
                No transactions yet. Deposits, withdrawals, and investments will appear here.
              </motion.li>
            ) : (
              latest.map((tx: UnifiedTransaction, i: number) => {
                const isCredit = tx.kind === "deposit" || tx.kind === "profit";
                const isInvestment = tx.kind === "investment";
                const iconClass = isCredit
                  ? "bg-[#d1fae5] text-[#059669]"
                  : isInvestment
                    ? "bg-[#dbeafe] text-[#1d4ed8]"
                    : "bg-[#fee2e2] text-[#dc2626]";
                return (
                  <motion.li
                    key={`${tx.kind}-${tx.id}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between py-4 first:pt-0"
                  >
                    <Link
                      href={txHref(tx)}
                      className="flex flex-1 items-center gap-3 transition-opacity hover:opacity-90"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                      >
                        {isCredit ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        ) : isInvestment ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <line x1="12" y1="20" x2="12" y2="10" />
                            <line x1="18" y1="20" x2="18" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="16" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">
                          {txLabel(tx.kind)}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatRelativeDate(tx.dateSortKey)} · {tx.asset}
                          {tx.kind !== "investment" && tx.status !== "completed" && tx.status !== "approved" && (
                            <span className="ml-1 capitalize"> · {tx.status}</span>
                          )}
                        </p>
                      </div>
                    </Link>
                    <Link
                      href={txHref(tx)}
                      className={`text-sm font-semibold transition-colors hover:opacity-80 ${
                        isCredit ? "text-[#059669]" : "text-[#111827]"
                      }`}
                    >
                      {formatAmount(tx.amount, tx.kind)}
                    </Link>
                  </motion.li>
                );
              })
            )}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}
