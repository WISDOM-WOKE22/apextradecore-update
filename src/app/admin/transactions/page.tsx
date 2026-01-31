"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useAllTransactions } from "@/services/admin/useAllTransactions";
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
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">All Transactions</h1>
          <p className="mt-1 text-sm text-text-secondary">
            View and manage all user transactions (deposits, withdrawals, investments).
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="self-start rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading transactions…</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            No transactions found. Only non-admin users are included.
          </div>
        ) : (
          <>
            <div className="table-scroll-wrap -mx-2 sm:mx-0">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
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
                <tbody className="divide-y divide-[#f3f4f6]">
                  {paginatedTransactions.map((tx) => (
                  <tr key={`${tx.kind}-${tx.userId}-${tx.id}`} className="transition-colors hover:bg-[#f9fafb]">
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      <span className="font-medium text-[#111827]">{kindLabel(tx.kind)}</span>
                    </td>
                    <td className="min-w-0 px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#111827]">{tx.userFullName || "—"}</p>
                        <p className="truncate text-xs text-text-secondary">{tx.userEmail || "—"}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-[#111827] sm:px-4 sm:py-3.5 lg:px-6">
                      ${tx.amountStr}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">
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
              <div className="flex flex-col items-center justify-between gap-4 border-t border-[#e5e7eb] px-4 py-3 sm:flex-row sm:px-6">
                <p className="text-sm text-text-secondary">
                  Showing <span className="font-medium text-[#111827]">{startItem}</span>
                  –<span className="font-medium text-[#111827]">{endItem}</span> of{" "}
                  <span className="font-medium text-[#111827]">{transactions.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-50"
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
    </motion.div>
  );
}
