"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
// Chart imports available if needed for future enhancements

const CONTRIBUTION_PERIODS = [1, 2, 3, 4, 5, 6];

const METRICS = [
  { label: "Staked Tokens Trend", value: "-0.82%", change: "negative", timeframe: "24H" },
  { label: "Price", value: "$41.99", change: "-1.09%", timeframe: "24H" },
  { label: "Staking Ratio", value: "60.6%", change: "positive", timeframe: "24H" },
];

const REWARD_RATES = [
  { label: "24H Ago", value: 2.23 },
  { label: "48H Ago", value: 1.46 },
];

export function ActiveStaking() {
  const [selectedPeriod, setSelectedPeriod] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState("General");

  const chartData = Array.from({ length: 30 }, (_, i) => ({
    value: 30 + Math.sin(i / 5) * 2 + (i / 30) * 1.5,
  }));

  const maxReward = Math.max(...REWARD_RATES.map((r) => r.value));

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#111827]">Your active stakings</h2>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Last Update - 45 minutes ago</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fef3c7]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-[#f59e0b]">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827]">Stake Avalanche (AVAX)</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-medium text-[#10b981]">↑ Trending</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb]">
              Upgrade
            </Button>
            <Button className="bg-accent text-white hover:bg-[#1552b8]">Unstake</Button>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-[#f9fafb] p-4">
          <div className="mb-2 text-sm font-medium text-text-secondary">
            Current Reward Balance, AVAX
          </div>
          <div className="text-3xl font-bold text-[#111827]">31.39686</div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {["Momentum", "General", "Risk", "Reward"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-accent text-white"
                  : "bg-[#f3f4f6] text-text-secondary hover:bg-[#e5e7eb]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-[#374151]">
            Contribution Period (Month)
          </label>
          <div className="flex gap-2">
            {CONTRIBUTION_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-accent text-white"
                    : "border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb]"
                }`}
              >
                {period} Month{period > 1 ? "s" : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4"
            >
              <div className="mb-1 text-xs font-medium text-text-secondary">{metric.label}</div>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#111827]">{metric.value}</span>
                <span
                  className={`text-sm font-medium ${
                    metric.change === "positive" ? "text-[#10b981]" : "text-[#ef4444]"
                  }`}
                >
                  {metric.change === "positive" ? "+" : ""}
                  {typeof metric.change === "string" && metric.change.includes("%")
                    ? metric.change
                    : ""}
                </span>
              </div>
              <button className="text-xs text-accent hover:underline">{metric.timeframe}</button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-3 text-sm font-medium text-[#374151]">Reward Rate</div>
          <div className="flex gap-4">
            {REWARD_RATES.map((rate, i) => (
              <div key={i} className="flex-1">
                <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                  <span>{rate.label}</span>
                  <span className="font-semibold text-[#111827]">{rate.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(rate.value / maxReward) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
