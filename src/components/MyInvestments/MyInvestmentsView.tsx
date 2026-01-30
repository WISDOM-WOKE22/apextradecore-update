"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useUserPlans } from "@/services/plans/useUserPlans";
import { DEFAULT_PLAN_MIN_AMOUNT } from "@/services/plans/defaultPlan";
import type { UserPlan } from "@/services/plans/types";

function formatPlanDate(dateStr: string, dateSortKey: number): string {
  if (dateSortKey > 0) {
    return new Date(dateSortKey).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return dateStr || "—";
}

export function MyInvestmentsView() {
  const userId = useAppStore((s) => s.user?.uid ?? null);
  const { plans, defaultPlan, loading, error } = useUserPlans(userId);

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

      {error && (
        <p className="mb-4 text-sm text-[#b91c1c]">{error}</p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-[#e5e7eb] bg-white"
            />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-[#e5e7eb] bg-white p-10 shadow-sm sm:p-12"
        >
          <div className="text-center">
            <p className="text-text-secondary">
              You have no investment plans yet. Start with our default plan and begin earning.
            </p>
            <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-5 text-left sm:inline-block sm:text-left">
              <p className="text-sm font-medium text-[#111827]">
                Default plan: {defaultPlan.planName}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Minimum ${DEFAULT_PLAN_MIN_AMOUNT} — 400% return in 3 business days.
              </p>
              <Link
                href="/investments"
                className="mt-4 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
              >
                Start investment with {defaultPlan.planName} →
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan: UserPlan, i: number) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
            >
              <Link
                href={`/my-investments/${encodeURIComponent(plan.id)}`}
                className="block rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-[#111827]">
                        {plan.planName}
                      </h2>
                      <span className="rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-xs font-medium text-[#1d4ed8]">
                        Active
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
                      <span>
                        Amount:{" "}
                        <span className="font-medium text-[#111827]">
                          ${plan.amountNum.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        Started:{" "}
                        <span className="font-medium text-[#111827]">
                          {formatPlanDate(plan.date, plan.dateSortKey)}
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
