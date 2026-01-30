"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { UserPlan } from "@/services/plans/types";

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

interface PlanDetailViewProps {
  plan: UserPlan;
}

export function PlanDetailView({ plan }: PlanDetailViewProps) {
  const expectedReturn = plan.amountNum * 4; // 400% return
  const stats = [
    { label: "Amount invested", value: `$${plan.amountNum.toLocaleString()}`, sub: "Principal" },
    { label: "Expected return", value: `$${expectedReturn.toLocaleString()}`, sub: "400% in 3 business days" },
    { label: "Plan", value: plan.planName, sub: "Investment plan" },
    { label: "Started", value: formatPlanDate(plan.dateSortKey, plan.date), sub: "Start date" },
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
        className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-5"
      >
        <p className="text-sm text-text-secondary">
          Returns are credited within 3 business days. Track this investment from your My Investments list.
        </p>
      </motion.div>
    </div>
  );
}
