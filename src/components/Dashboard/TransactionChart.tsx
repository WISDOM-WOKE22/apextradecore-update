"use client";

import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DATA = [
  { month: "Jan", amount: 4200 },
  { month: "Feb", amount: 5800 },
  { month: "Mar", amount: 5100 },
  { month: "Apr", amount: 7200 },
  { month: "May", amount: 6800 },
  { month: "Jun", amount: 8900 },
  { month: "Jul", amount: 9200 },
  { month: "Aug", amount: 7800 },
  { month: "Sep", amount: 10500 },
  { month: "Oct", amount: 11200 },
  { month: "Nov", amount: 9800 },
  { month: "Dec", amount: 12400 },
];

export function TransactionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111827]">Transaction Overview</h2>
        <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-accent">
          Last 12 months
        </span>
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="url(#chartGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
