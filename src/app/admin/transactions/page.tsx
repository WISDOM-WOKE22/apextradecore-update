"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useAllTransactions } from "@/services/admin/useAllTransactions";
import { getWithdrawalFeePercent, setWithdrawalFeePercent } from "@/services/admin/withdrawalFeeSettings";
import type { AdminTransactionKind } from "@/services/admin/types";

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  const styles: Record<string, string> = {
    completed: "bg-[#d1fae5] text-[#059669]",
    approved: "bg-[#d1fae5] text-[#059669]",
    active: "bg-[#dbeafe] text-[#1d4ed8]",
    pending: "bg-[#fef3c7] text-[#b45309]",
    failed: "bg-[#fee2e2] text-[#dc2626]",
    rejected: "bg-[#fee2e2] text-[#dc2626]",
  };
  const style = styles[s] ?? "bg-[#f3f4f6] text-[#6b7280]";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status || "Pending"}
    </span>
  );
}

function kindLabel(kind: AdminTransactionKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export default function AdminTransactionsPage() {
  const { transactions, loading, error, refetch } = useAllTransactions();
  const [page, setPage] = useState(1);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [feePercent, setFeePercent] = useState<number | "">("");
  const [feeCurrentPercent, setFeeCurrentPercent] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeSuccess, setFeeSuccess] = useState(false);

  const loadFee = useCallback(async () => {
    setFeeLoading(true);
    setFeeError(null);
    const result = await getWithdrawalFeePercent();
    setFeeLoading(false);
    if (result.success) {
      setFeeCurrentPercent(result.percent);
      setFeePercent(result.percent === 0 ? "" : result.percent);
    } else {
      setFeeError(result.error);
    }
  }, []);

  useEffect(() => {
    if (feeModalOpen) loadFee();
  }, [feeModalOpen, loadFee]);

  const openFeeModal = () => {
    setFeeSuccess(false);
    setFeeError(null);
    setFeePercent("");
    setFeeModalOpen(true);
  };

  const closeFeeModal = () => {
    if (!feeSaving) setFeeModalOpen(false);
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = feePercent === "" ? 0 : Number(feePercent);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      setFeeError("Enter a percentage between 0 and 100.");
      return;
    }
    setFeeError(null);
    setFeeSaving(true);
    const result = await setWithdrawalFeePercent(value);
    setFeeSaving(false);
    if (result.success) {
      setFeeCurrentPercent(value);
      setFeeSuccess(true);
      setTimeout(() => {
        setFeeSuccess(false);
        setFeeModalOpen(false);
      }, 1200);
    } else {
      setFeeError(result.error);
    }
  };

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, currentPage]);

  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, transactions.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-w-0"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">All Transactions</h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
            View and manage all user transactions (deposits, withdrawals, investments).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openFeeModal}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Withdrawal fee
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
          {error}
        </div>
      )}

      <div className="min-w-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading transactions…</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary dark:text-[#a3a3a3]">
            No transactions found. Only non-admin users are included.
          </div>
        ) : (
          <>
            <div className="table-scroll-wrap mx-0 sm:-mx-2">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#262626]">
                    <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
                      Type
                    </th>
                    <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
                      User
                    </th>
                    <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
                      Amount
                    </th>
                    <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                  {paginatedTransactions.map((tx) => (
                  <tr key={`${tx.kind}-${tx.userId}-${tx.id}`} className="transition-colors hover:bg-[#f9fafb] dark:hover:bg-[#262626]">
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      <span className="font-medium text-[#111827] dark:text-[#f5f5f5]">{kindLabel(tx.kind)}</span>
                    </td>
                    <td className="min-w-0 px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#111827] dark:text-[#f5f5f5]">{tx.userFullName || "—"}</p>
                        <p className="truncate text-xs text-text-secondary dark:text-[#a3a3a3]">{tx.userEmail || "—"}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">
                      ${tx.amountStr}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4 sm:py-3.5 lg:px-6">
                      {tx.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">
                      <Link
                        href={`/admin/transactions/${tx.kind}/${encodeURIComponent(tx.userId)}/${encodeURIComponent(tx.id)}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-[#1552b8]"
                      >
                        View details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-[#e5e7eb] px-4 py-3 dark:border-[#2a2a2a] sm:flex-row sm:px-6">
                <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">
                  Showing <span className="font-medium text-[#111827] dark:text-[#f5f5f5]">{startItem}</span>
                  –<span className="font-medium text-[#111827] dark:text-[#f5f5f5]">{endItem}</span> of{" "}
                  <span className="font-medium text-[#111827] dark:text-[#f5f5f5]">{transactions.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages: (number | "ellipsis")[] = [];
                      if (totalPages <= 7) {
                        for (let p = 1; p <= totalPages; p++) pages.push(p);
                      } else {
                        pages.push(1);
                        if (currentPage - 1 > 2) pages.push("ellipsis");
                        const lo = Math.max(2, currentPage - 1);
                        const hi = Math.min(totalPages - 1, currentPage + 1);
                        for (let p = lo; p <= hi; p++) pages.push(p);
                        if (currentPage + 1 < totalPages - 1) pages.push("ellipsis");
                        if (totalPages > 1) pages.push(totalPages);
                      }
                      return pages.map((item, idx) =>
                        item === "ellipsis" ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-text-secondary">
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setPage(item)}
                            className={`min-w-9 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                              item === currentPage
                                ? "bg-accent text-white"
                                : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
                            }`}
                          >
                            {item}
                          </button>
                        )
                      );
                    })()}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Withdrawal fee modal */}
      <AnimatePresence>
        {feeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeFeeModal}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="withdrawal-fee-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 id="withdrawal-fee-title" className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">
                  Withdrawal fee
                </h2>
                <button
                  type="button"
                  onClick={closeFeeModal}
                  disabled={feeSaving}
                  className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-[#f3f4f6] hover:text-[#111827] disabled:opacity-50 dark:hover:bg-[#262626] dark:hover:text-[#f5f5f5]"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
                Set the percentage fee applied to user withdrawals. Use 0 for no fee.
              </p>

              {feeLoading ? (
                <div className="mt-6 flex items-center justify-center gap-2 py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <span className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading…</span>
                </div>
              ) : (
                <form onSubmit={handleSaveFee} className="mt-6 space-y-4">
                  {feeCurrentPercent !== null && (
                    <div className="rounded-lg bg-[#f9fafb] px-4 py-3 dark:bg-[#262626]">
                      <p className="text-xs font-medium text-text-secondary dark:text-[#a3a3a3]">Current fee</p>
                      <p className="mt-0.5 text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">
                        {feeCurrentPercent === 0 ? "0%" : `${feeCurrentPercent}%`}
                      </p>
                    </div>
                  )}
                  <div>
                    <label htmlFor="withdrawal-fee-percent" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
                      Fee percentage (0–100)
                    </label>
                    <div className="relative">
                      <input
                        id="withdrawal-fee-percent"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        placeholder="0"
                        value={feePercent === "" ? "" : feePercent}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") setFeePercent("");
                          else {
                            const n = parseFloat(v);
                            if (!Number.isNaN(n)) setFeePercent(n);
                          }
                          setFeeError(null);
                        }}
                        disabled={feeSaving}
                        className="w-full rounded-lg border border-[#e5e7eb] bg-white py-3 pl-4 pr-10 text-[#111827] placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:placeholder:text-[#737373]"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-[#a3a3a3]">%</span>
                    </div>
                  </div>
                  {feeError && (
                    <p className="text-sm text-[#b91c1c] dark:text-[#fca5a5]" role="alert">
                      {feeError}
                    </p>
                  )}
                  {feeSuccess && (
                    <p className="text-sm text-[#059669] dark:text-[#34d399]" role="status">
                      Saved. Closing…
                    </p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeFeeModal}
                      disabled={feeSaving}
                      className="flex-1 rounded-lg border border-[#e5e7eb] bg-white py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-50 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={feeSaving}
                      className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1552b8] disabled:opacity-50"
                    >
                      {feeSaving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
