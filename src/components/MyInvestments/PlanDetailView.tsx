"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePlanTransactions } from "@/services/plans/usePlanTransactions";
import type { UserPlan } from "@/services/plans/types";
import type { PlanTransaction } from "@/services/plans/fetchPlanTransactions";

function formatPlanDate(dateSortKey: number, dateStr: string): string {
  if (dateSortKey > 0) {
    return new Date(dateSortKey).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return dateStr || "—";
}

type ViewMode = "table" | "timeline";

interface PlanDetailViewProps {
  plan: UserPlan;
  userId: string | null;
}

export function PlanDetailView({ plan, userId }: PlanDetailViewProps) {
  const { transactions, loading: txLoading, error: txError } = usePlanTransactions(userId, plan);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const expectedReturn = plan.amountNum * 4; // 400% return
  const totalProfit = plan.totalProfit ?? 0;
  const stats = [
    { label: "Amount invested", value: `$${plan.amountNum.toLocaleString()}`, sub: "Principal" },
    ...(totalProfit > 0
      ? [{ label: "Profit earned", value: `$${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, sub: "Credited to plan" }]
      : []),
    { label: "Expected return", value: `$${expectedReturn.toLocaleString()}`, sub: "400% in 3 business days" },
    // { label: "Plan", value: plan.planName, sub: "Investment plan" },
    // { label: "Started", value: formatPlanDate(plan.dateSortKey, plan.date), sub: "Start date" },
  ];

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6"
      >
        <Link
          href="/my-investments"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          My investments
        </Link>
      </motion.div>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
            {plan.planName}
          </h1>
          <span className="rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-xs font-medium text-[#1d4ed8]">
            Active
          </span>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          Started: {formatPlanDate(plan.dateSortKey, plan.date)}
        </p>
      </motion.header>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-[#111827] sm:text-xl">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-5"
      >
        <p className="text-sm text-text-secondary">
          Returns are credited within 3 business days. Track this investment from your My Investments list.
        </p>
      </motion.div>

      {/* Plan transactions */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-[#e5e7eb] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h2 className="text-lg font-bold text-[#111827]">Plan transactions</h2>
          <div className="flex rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "table" ? "bg-white text-[#111827] shadow-sm" : "text-text-secondary hover:text-[#111827]"
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === "timeline" ? "bg-white text-[#111827] shadow-sm" : "text-text-secondary hover:text-[#111827]"
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {txError && (
          <div className="border-b border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] sm:px-6">
            {txError}
          </div>
        )}

        {txLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading transactions…</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            No transactions yet. Investment and profit credits will appear here.
          </div>
        ) : viewMode === "table" ? (
          <div className="table-scroll-wrap -mx-2 sm:mx-0">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Date</th>
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Type</th>
                  <th className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                <AnimatePresence>
                  {transactions.map((tx, i) => (
                    <motion.tr
                      key={`${tx.type}-${tx.id}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.02 * i }}
                      className="transition-colors hover:bg-[#fafafa]"
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-sm text-[#111827] sm:px-4 sm:py-3.5 lg:px-6">
                        {tx.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tx.type === "investment"
                              ? "bg-[#dbeafe] text-[#1d4ed8]"
                              : "bg-[#d1fae5] text-[#059669]"
                          }`}
                        >
                          {tx.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-medium sm:px-4 sm:py-3.5 lg:px-6">
                        <span className={tx.type === "profit" ? "text-[#059669]" : "text-[#111827]"}>
                          {tx.type === "profit" ? "+" : ""}$
                          {tx.amountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#e5e7eb] sm:left-5" />
              <ul className="space-y-0">
                {transactions.map((tx, i) => (
                  <motion.li
                    key={`${tx.type}-${tx.id}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.03 * i }}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm sm:h-10 sm:w-10 ${
                        tx.type === "investment" ? "bg-[#3b82f6]" : "bg-[#059669]"
                      }`}
                    >
                      {tx.type === "investment" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white sm:h-4 sm:w-4">
                          <line x1="12" y1="20" x2="12" y2="10" />
                          <line x1="18" y1="20" x2="18" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="16" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white sm:h-4 sm:w-4">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tx.type === "investment"
                              ? "bg-[#dbeafe] text-[#1d4ed8]"
                              : "bg-[#d1fae5] text-[#059669]"
                          }`}
                        >
                          {tx.label}
                        </span>
                        <span className={`text-sm font-semibold ${tx.type === "profit" ? "text-[#059669]" : "text-[#111827]"}`}>
                          {tx.type === "profit" ? "+" : ""}$
                          {tx.amountNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-text-secondary">{tx.date}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}
