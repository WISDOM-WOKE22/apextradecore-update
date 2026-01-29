"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export function LiquidStakingPortfolio() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#e5e7eb] bg-linear-to-br from-[#6366f1] to-[#8b5cf6] p-6 text-white shadow-lg"
    >
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-bold">Liquid Staking Portfolio</h3>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
          New
        </span>
      </div>
      <p className="mb-6 text-sm text-white/90">
        An all-in-one portfolio that helps you make smarter investments into Ethereum Liquid
        Staking.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="bg-white text-[#6366f1] hover:bg-white/90"
          onClick={() => alert("Connecting wallet...")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-2"
          >
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <line x1="21" y1="3" x2="12" y2="12" />
            <polyline points="12 3 21 3 21 12" />
          </svg>
          Connect with Wallet
        </Button>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter a Wallet Address"
            className="flex-1 rounded-lg border-0 bg-white/20 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Button
            className="bg-white/20 text-white hover:bg-white/30"
            onClick={() => {
              if (walletAddress) {
                alert(`Fetching portfolio for ${walletAddress}...`);
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
