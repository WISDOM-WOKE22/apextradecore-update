"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAdminDashboard } from "@/services/admin/useAdminDashboard";
import type { AdminTransactionKind } from "@/services/admin/types";

const CHART_LIGHT = { grid: "#f3f4f6", tick: "#6b7280", tooltipBorder: "#e5e7eb", tooltipBg: "#ffffff" };
const CHART_DARK = { grid: "#262626", tick: "#a3a3a3", tooltipBorder: "#2a2a2a", tooltipBg: "#1a1a1a" };

function kindLabel(kind: AdminTransactionKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

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
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status || "Pending"}
    </span>
  );
}

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAdminDashboard();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const chartColors = isDark ? CHART_DARK : CHART_LIGHT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
            Overview and management for ApexTradeCore.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="self-start rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/users"
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-[#404040] dark:hover:bg-[#262626]"
        >
          <p className="text-sm font-medium text-text-secondary dark:text-[#a3a3a3]">Users</p>
          <p className="mt-1 text-2xl font-bold text-[#111827] tabular-nums dark:text-[#f5f5f5]">
            {loading ? "—" : (data?.usersCount ?? 0).toLocaleString()}
          </p>
          <span className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            Manage users →
          </span>
        </Link>
        <Link
          href="/admin/transactions"
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-[#404040] dark:hover:bg-[#262626]"
        >
          <p className="text-sm font-medium text-text-secondary dark:text-[#a3a3a3]">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-[#111827] tabular-nums dark:text-[#f5f5f5]">
            {loading ? "—" : (data?.transactionsCount ?? 0).toLocaleString()}
          </p>
          <span className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            View all →
          </span>
        </Link>
        <Link
          href="/admin/wallets"
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-[#404040] dark:hover:bg-[#262626]"
        >
          <p className="text-sm font-medium text-text-secondary dark:text-[#a3a3a3]">Wallets</p>
          <p className="mt-1 text-2xl font-bold text-[#111827] tabular-nums dark:text-[#f5f5f5]">—</p>
          <span className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            Manage wallets →
          </span>
        </Link>
        <Link
          href="/admin/plans"
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-colors hover:border-[#d1d5db] hover:bg-[#fafafa] dark:border-[#2a2a2a] dark:bg-[#1a1a1a] dark:hover:border-[#404040] dark:hover:bg-[#262626]"
        >
          <p className="text-sm font-medium text-text-secondary dark:text-[#a3a3a3]">Plans (investments)</p>
          <p className="mt-1 text-2xl font-bold text-[#111827] tabular-nums dark:text-[#f5f5f5]">
            {loading ? "—" : (data?.plansCount ?? 0).toLocaleString()}
          </p>
          <span className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
            Manage plans →
          </span>
        </Link>
      </div>

      {/* Charts row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Monthly deposits */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Deposits by month</h2>
            <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-medium text-[#059669] dark:bg-[#064e3b] dark:text-[#6ee7b7]">
              Last 12 months
            </span>
          </div>
          {loading ? (
            <div className="flex h-[280px] w-full items-center justify-center rounded-lg bg-[#f9fafb] dark:bg-[#262626]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : !data?.monthlyDeposits?.length ? (
            <div className="flex h-[280px] w-full items-center justify-center rounded-lg bg-[#f9fafb] text-sm text-text-secondary dark:bg-[#262626] dark:text-[#a3a3a3]">
              No deposit data yet.
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthlyDeposits}
                  margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="adminDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 12, fill: chartColors.tick }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: chartColors.tick }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      backgroundColor: chartColors.tooltipBg,
                      boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number | undefined) => [
                      `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                      "Total",
                    ]}
                    labelFormatter={(label) => label}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Deposits"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="url(#adminDeposits)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Monthly signups */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">User signups by month</h2>
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-accent dark:bg-accent/20">
              Last 12 months
            </span>
          </div>
          {loading ? (
            <div className="flex h-[280px] w-full items-center justify-center rounded-lg bg-[#f9fafb] dark:bg-[#262626]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : !data?.monthlySignups?.length ? (
            <div className="flex h-[280px] w-full items-center justify-center rounded-lg bg-[#f9fafb] text-sm text-text-secondary dark:bg-[#262626] dark:text-[#a3a3a3]">
              No signup data yet.
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthlySignups}
                  margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="adminSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 12, fill: chartColors.tick }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: chartColors.tick }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      backgroundColor: chartColors.tooltipBg,
                      boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number | undefined) => [value ?? 0, "Signups"]}
                    labelFormatter={(label) => label}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Signups"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fill="url(#adminSignups)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Latest 5 transactions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8 min-w-0 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
      >
        <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 dark:border-[#2a2a2a] dark:bg-[#262626] sm:px-6">
          <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Latest transactions</h2>
          <Link
            href="/admin/transactions"
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading…</p>
          </div>
        ) : !data?.latestTransactions?.length ? (
          <div className="py-12 text-center text-sm text-text-secondary dark:text-[#a3a3a3]">
            No transactions yet.
          </div>
        ) : (
          <div className="table-scroll-wrap mx-0 sm:-mx-2">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary dark:border-[#2a2a2a] dark:text-[#a3a3a3]">
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Type</th>
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">User</th>
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Amount</th>
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Date</th>
                  <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Status</th>
                  <th className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                {data.latestTransactions.map((tx) => (
                  <tr
                    key={`${tx.kind}-${tx.userId}-${tx.id}`}
                    className="transition-colors hover:bg-[#f9fafb] dark:hover:bg-[#262626]"
                  >
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">
                      {kindLabel(tx.kind)}
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
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                      >
                        View
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
        )}
      </motion.div>
    </motion.div>
  );
}
