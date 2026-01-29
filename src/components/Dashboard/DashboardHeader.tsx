"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect, useRef } from "react";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            {onMenuClick && (
              <button
                type="button"
                onClick={onMenuClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary hover:bg-[#f3f4f6] hover:text-[#111827] lg:hidden"
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <h2 className="text-base font-semibold text-[#111827] sm:text-lg">
              Top Staking Assets
            </h2>
          </div>

          <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-accent">
                  RC
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold">@ryan997 PRO</p>
                  <p className="text-xs text-text-secondary">Ryan Crawford</p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-[#e5e7eb] bg-white py-2 shadow-lg"
                >
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  >
                    Profile
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]"
                  >
                    Settings
                  </a>
                  <hr className="my-2 border-[#e5e7eb]" />
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-sm text-[#ef4444] hover:bg-[#f9fafb]"
                  >
                    Sign out
                  </a>
                </motion.div>
              )}
            </div>

            <button className="relative rounded-lg p-2 text-text-secondary hover:bg-[#f9fafb] hover:text-[#111827]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-semibold text-white">
                2
              </span>
            </button>

          </div>
        </div>
      </header>

      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}
    </>
  );
}

function DepositModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("ETH");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#111827]">Deposit Funds</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-secondary hover:bg-[#f9fafb]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Select Asset
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="AVAX">Avalanche (AVAX)</option>
              <option value="MATIC">Polygon (MATIC)</option>
              <option value="SOL">Solana (SOL)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(`Depositing ${amount} ${selectedAsset}...`);
                onClose();
              }}
              className="flex-1 bg-accent text-white hover:bg-[#1552b8]"
            >
              Deposit
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
