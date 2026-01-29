"use client";

import { motion } from "motion/react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StakingAssetCardProps {
  name: string;
  symbol: string;
  icon: React.ReactNode;
  rewardRate: number;
  change24h: number;
  chartData: { value: number }[];
  chartColor: string;
}

export function StakingAssetCard({
  name,
  symbol,
  icon,
  rewardRate,
  change24h,
  chartData,
  chartColor,
}: StakingAssetCardProps) {
  const isPositive = change24h > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f4f6]">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#111827]">{name}</h3>
            <span className="text-xs text-text-secondary">Proof of Stake</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#111827]">{rewardRate}%</span>
          <span className="text-sm font-medium text-text-secondary">Reward Rate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
          >
            {isPositive ? "+" : ""}
            {change24h}%
          </span>
          <span className="text-xs text-text-secondary">24H</span>
        </div>
      </div>

      <div className="h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
