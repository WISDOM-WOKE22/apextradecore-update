"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { MyInvestment, InvestmentStatus } from "@/data/myInvestments";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface InvestmentDetailViewProps {
  investment: MyInvestment;
}

export function InvestmentDetailView({ investment }: InvestmentDetailViewProps) {
  const { planName, status, invested, returns, bonus, progress, expectedEndDate, timeline, color } =
    investment;

  const stats = [
    { label: "Invested", value: `$${invested.toLocaleString()}`, sub: "Principal" },
    { label: "Returns", value: `$${returns.toLocaleString()}`, sub: "So far / total" },
    { label: "Bonus", value: `$${bonus.toLocaleString()}`, sub: "Added to account" },
    { label: "Progress", value: `${progress}%`, sub: "Toward maturity" },
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
            {planName}
          </h1>
          <StatusBadge status={status} />
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          Expected completion: {formatDate(expectedEndDate)}
        </p>
      </motion.header>

      {/* Stats grid */}
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

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-text-secondary">Progress</span>
          <span className="font-medium text-[#111827]">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full bg-linear-to-r ${color}`}
          />
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Timeline</h2>
        <div className="relative">
          {/* vertical line */}
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px bg-[#e5e7eb]"
            aria-hidden
          />
          <ul className="space-y-0">
            {timeline.map((event, i) => (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    event.completed
                      ? "border-[#059669] bg-[#d1fae5]"
                      : "border-[#e5e7eb] bg-white"
                  }`}
                >
                  {event.completed ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d1d5db]" />
                  )}
                </div>
                <div className="min-w-0 flex-1 rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[#111827]">{event.label}</p>
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {formatDate(event.date)}
                      </p>
                      {event.description && (
                        <p className="mt-1 text-xs text-text-secondary">
                          {event.description}
                        </p>
                      )}
                    </div>
                    {event.amount != null && (
                      <span
                        className={`text-sm font-semibold ${
                          event.completed ? "text-[#059669]" : "text-text-secondary"
                        }`}
                      >
                        {event.completed ? "+" : ""}$
                        {event.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
