"use client";

import { motion } from "motion/react";
import { StakingAssetCard } from "./StakingAssetCard";

const ASSETS = [
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 17.97L4.58 13.62 11.943 24 19.31 13.62 11.944 17.97zm11.227-1.54L13.17 0 11.943 6.36 18.31 12.74 23.17 16.43zm-22.34 0L5.638 12.74 11.944 6.36 10.717 0 1.83 16.43z" />
      </svg>
    ),
    rewardRate: 13.62,
    change24h: 6.25,
    chartColor: "#6366f1",
    chartData: Array.from({ length: 20 }, (_, i) => ({
      value: 2000 + Math.sin(i / 3) * 500 + i * 50,
    })),
  },
  {
    name: "BNB Chain",
    symbol: "BNB",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    rewardRate: 12.72,
    change24h: 5.67,
    chartColor: "#f59e0b",
    chartData: Array.from({ length: 20 }, (_, i) => ({
      value: 1500 + Math.sin(i / 3) * 400 + i * 40,
    })),
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    rewardRate: 6.29,
    change24h: -1.89,
    chartColor: "#8b5cf6",
    chartData: Array.from({ length: 20 }, (_, i) => ({
      value: 800 - Math.sin(i / 3) * 200 - i * 20,
    })),
  },
];

export function TopStakingAssets() {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">Recommended coins for 24 hours</p>
          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#111827]">Top Staking Assets</h2>
            <span className="rounded-full bg-[#eef2ff] px-2.5 py-0.5 text-xs font-semibold text-accent">
              {ASSETS.length} Assets
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]">
            24H
          </button>
          <button className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]">
            Proof of Stake
          </button>
          <button className="flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]">
            Desc
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ASSETS.map((asset, i) => (
          <StakingAssetCard key={asset.symbol} {...asset} />
        ))}
      </div>
    </section>
  );
}
