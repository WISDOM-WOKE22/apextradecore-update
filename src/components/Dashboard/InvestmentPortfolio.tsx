"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useUserPlans } from "@/services/plans/useUserPlans";
import type { UserPlan } from "@/services/plans/types";

const PLAN_COLORS: Record<string, string> = {
  Starter: "from-[#0ea5e9] to-[#06b6d4]",
  Deluxe: "from-[#6366f1] to-[#8b5cf6]",
  Standard: "from-[#64748b] to-[#94a3b8]",
  Premium: "from-[#059669] to-[#10b981]",
  Gold: "from-[#b45309] to-[#f59e0b]",
};

function getPlanColor(planName: string): string {
  return PLAN_COLORS[planName] ?? "from-[#6366f1] to-[#8b5cf6]";
}

export function InvestmentPortfolio() {
  const userId = useAppStore((s) => s.user?.uid ?? null);
  const { plans, defaultPlan, loading, error } = useUserPlans(userId);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Investment Portfolio</h2>
        <Link
          href="/my-investments"
          className="text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
        >
          View all
        </Link>
      </div>

      {error && (
        <p className="mb-4 text-sm text-[#b91c1c] dark:text-[#fca5a5]">{error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-[#e5e7eb] bg-white p-5 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
            />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="group rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
          >
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#f3f4f6] dark:bg-[#262626]">
              <div className="h-full w-0 rounded-full bg-linear-to-r from-[#0ea5e9] to-[#06b6d4]" />
            </div>
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#f5f5f5]">{defaultPlan.planName}</h3>
            <div className="mt-2 space-y-1 text-xs text-text-secondary dark:text-[#a3a3a3]">
              <p>Invested: <span className="font-medium text-[#111827] dark:text-[#f5f5f5]">$0</span></p>
              <p>Start with as little as ${defaultPlan.amountNum} — 400% return.</p>
            </div>
            <Link
              href="/investments"
              className="mt-4 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
            >
              Invest now →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
            className="rounded-xl border border-dashed border-[#e5e7eb] bg-[#f9fafb] p-5 dark:border-[#2a2a2a] dark:bg-[#262626]"
          >
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">
              Add more plans from the Investments page.
            </p>
            <Link
              href="/investments"
              className="mt-3 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
            >
              View plans →
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan: UserPlan, i: number) => {
            const invested = plan.amountNum;
            const expectedReturns = invested * 4;
            const color = getPlanColor(plan.planName);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: "easeOut" }}
                whileHover={{ y: -2 }}
                className="group rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
              >
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#f3f4f6] dark:bg-[#262626]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full bg-linear-to-r ${color}`}
                  />
                </div>
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#f5f5f5]">{plan.planName}</h3>
                <div className="mt-2 space-y-1 text-xs text-text-secondary dark:text-[#a3a3a3]">
                  <p>Invested: <span className="font-medium text-[#111827] dark:text-[#f5f5f5]">${invested.toLocaleString()}</span></p>
                  <p>Expected returns: <span className="font-medium text-[#111827] dark:text-[#f5f5f5]">${expectedReturns.toLocaleString()}</span></p>
                </div>
                <Link
                  href={`/my-investments/${encodeURIComponent(plan.id)}`}
                  className="mt-4 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
                >
                  View details →
                </Link>
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + plans.length * 0.05, ease: "easeOut" }}
            className="rounded-xl border border-dashed border-[#e5e7eb] bg-[#f9fafb] p-5 dark:border-[#2a2a2a] dark:bg-[#262626]"
          >
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">
              Start another investment.
            </p>
            <Link
              href="/investments"
              className="mt-3 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
            >
              Invest now →
            </Link>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
}
