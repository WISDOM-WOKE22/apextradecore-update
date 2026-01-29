"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MOCK_MY_INVESTMENTS } from "@/data/myInvestments";
import type { InvestmentStatus } from "@/data/myInvestments";

function StatusBadge({ status }: { status: InvestmentStatus }) {
  const styles: Record<InvestmentStatus, string> = {
    active: "bg-[#dbeafe] text-[#1d4ed8]",
    completed: "bg-[#d1fae5] text-[#059669]",
    pending: "bg-[#fef3c7] text-[#b45309]",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function MyInvestmentsView() {
  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
          My investments
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Track your active and completed investments, returns, and timeline.
        </p>
      </motion.div>

      {MOCK_MY_INVESTMENTS.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-[#e5e7eb] bg-white p-12 text-center shadow-sm"
        >
          <p className="text-text-secondary">You have no investments yet.</p>
          <Link
            href="/investments"
            className="mt-4 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
          >
            Start an investment →
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {MOCK_MY_INVESTMENTS.map((inv, i) => (
            <motion.article
              key={inv.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
            >
              <Link
                href={`/my-investments/${inv.id}`}
                className="block rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-[#111827]">
                        {inv.planName}
                      </h2>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-[#f3f4f6] sm:max-w-[280px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${inv.progress}%` }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                        className={`h-full rounded-full bg-linear-to-r ${inv.color}`}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
                      <span>
                        Invested:{" "}
                        <span className="font-medium text-[#111827]">
                          ${inv.invested.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        Returns:{" "}
                        <span className="font-medium text-[#111827]">
                          ${inv.returns.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent sm:shrink-0">
                    View details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
