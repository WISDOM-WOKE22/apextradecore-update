"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { UnifiedTransaction } from "@/services/transactions/types";
import type { FetchUserTransactionsResult } from "@/services/transactions/fetchUserTransactions";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_MONTHS = 6;

interface TransactionChartProps {
  data: FetchUserTransactionsResult | null;
  loading: boolean;
  error: string | null;
}

interface ChartBucket {
  monthKey: string;
  monthLabel: string;
  year: number;
  sortKey: number;
  depositsApproved: number;
  depositsPending: number;
  withdrawalsApproved: number;
  withdrawalsPending: number;
}

function aggregateByMonth(all: UnifiedTransaction[]): ChartBucket[] {
  const buckets = new Map<string, ChartBucket>();

  function getMonthKey(dateStr: string, dateSortKey: number, kind: "deposit" | "withdrawal" | "investment", id: string): { key: string; year: number; month: number } {
    let y = 0;
    let m = 0;
    if (dateStr) {
      const parts = dateStr.split("-").map(Number);
      if (parts.length === 3) {
        const [, month, year] = parts;
        y = year;
        m = month;
      }
    }
    if (!y && kind === "withdrawal" && id) {
      const ts = parseInt(id, 10);
      if (!Number.isNaN(ts)) {
        const d = new Date(ts);
        y = d.getFullYear();
        m = d.getMonth() + 1;
      }
    }
    if (!y && kind === "investment" && dateSortKey) {
      const d = new Date(dateSortKey);
      y = d.getFullYear();
      m = d.getMonth() + 1;
    }
    if (!y) {
      const d = new Date(dateSortKey || Date.now());
      y = d.getFullYear();
      m = d.getMonth() + 1;
    }
    const key = `${y}-${String(m).padStart(2, "0")}`;
    return { key, year: y, month: m };
  }

  for (const tx of all) {
    const kindForKey =
      tx.kind === "profit" || tx.kind === "investment_return" ? "investment" : tx.kind;
    const { key, year, month } = getMonthKey(tx.date, tx.dateSortKey, kindForKey, tx.id);
    if (!buckets.has(key)) {
      const shortYear = String(year).slice(-2);
      buckets.set(key, {
        monthKey: key,
        monthLabel: `${MONTH_LABELS[month - 1] ?? month} ${shortYear}`,
        year,
        sortKey: year * 12 + month,
        depositsApproved: 0,
        depositsPending: 0,
        withdrawalsApproved: 0,
        withdrawalsPending: 0,
      });
    }
    const b = buckets.get(key)!;
    const amt = tx.amountNum;
    const approved = tx.status === "completed" || tx.status === "approved";

    if (tx.kind === "deposit") {
      if (approved) b.depositsApproved += amt;
      else b.depositsPending += amt;
    } else if (tx.kind === "withdrawal") {
      if (approved) b.withdrawalsApproved += amt;
      else b.withdrawalsPending += amt;
    }
    // investments are not charted
  }

  const now = new Date();
  const currentSortKey = now.getFullYear() * 12 + (now.getMonth() + 1);

  // Always build 6 months so the area chart has width (no single-dot look)
  const result: ChartBucket[] = [];
  for (let i = CHART_MONTHS - 1; i >= 0; i--) {
    const sortKey = currentSortKey - i;
    const year = Math.floor(sortKey / 12);
    const month = sortKey % 12 || 12;
    const key = `${year}-${String(month).padStart(2, "0")}`;
    const shortYear = String(year).slice(-2);
    const existing = buckets.get(key);
    result.push(
      existing ?? {
        monthKey: key,
        monthLabel: `${MONTH_LABELS[month - 1] ?? month} ${shortYear}`,
        year,
        sortKey,
        depositsApproved: 0,
        depositsPending: 0,
        withdrawalsApproved: 0,
        withdrawalsPending: 0,
      }
    );
  }
  return result;
}

const CHART_LIGHT = { grid: "#f3f4f6", tick: "#6b7280", tooltipBorder: "#e5e7eb", tooltipBg: "#ffffff" };
const CHART_DARK = { grid: "#262626", tick: "#a3a3a3", tooltipBorder: "#2a2a2a", tooltipBg: "#1a1a1a" };

export function TransactionChart({ data, loading, error }: TransactionChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const chartColors = isDark ? CHART_DARK : CHART_LIGHT;
  const chartData = useMemo(() => aggregateByMonth(data?.all ?? []), [data?.all]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Transaction Overview</h2>
        <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-accent dark:bg-accent/20">
          Last {CHART_MONTHS} months
        </span>
      </div>

      {error && (
        <p className="py-4 text-sm text-[#b91c1c] dark:text-[#fca5a5]">{error}</p>
      )}

      {loading ? (
        <div className="flex h-[280px] w-full items-center justify-center rounded-lg bg-[#f9fafb] dark:bg-[#262626]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-[280px] w-full items-center justify-center rounded-lg bg-[#f9fafb] text-sm text-text-secondary dark:bg-[#262626] dark:text-[#a3a3a3]">
          No transaction data yet. Deposits and withdrawals will appear here.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="depApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.65} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="depPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="wdApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.65} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="wdPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.06} />
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
                formatter={(value, name) => [
                  `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                  String(name ?? "").replace(/([A-Z])/g, " $1").replace(/^./, (s: string) => s.toUpperCase()),
                ]}
                labelFormatter={(label) => label}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => value.replace(/([A-Z])/g, " $1").trim()}
              />
              <Area type="monotone" dataKey="depositsApproved" name="Deposits (Approved)" stroke="#059669" strokeWidth={2.5} fill="url(#depApproved)" stackId="dep" isAnimationActive />
              <Area type="monotone" dataKey="depositsPending" name="Deposits (Pending)" stroke="#34d399" strokeWidth={2.5} fill="url(#depPending)" stackId="dep" isAnimationActive />
              <Area type="monotone" dataKey="withdrawalsApproved" name="Withdrawals (Approved)" stroke="#dc2626" strokeWidth={2.5} fill="url(#wdApproved)" stackId="wd" isAnimationActive />
              <Area type="monotone" dataKey="withdrawalsPending" name="Withdrawals (Pending)" stroke="#f87171" strokeWidth={2.5} fill="url(#wdPending)" stackId="wd" isAnimationActive />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
