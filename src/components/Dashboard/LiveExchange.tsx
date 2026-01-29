"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ExchangeRate {
  pair: string;
  rate: number;
  change24h: number;
}

const INITIAL_RATES: ExchangeRate[] = [
  { pair: "ETH/USD", rate: 2456.78, change24h: 2.45 },
  { pair: "BTC/USD", rate: 43256.89, change24h: 1.23 },
  { pair: "AVAX/USD", rate: 41.99, change24h: -1.09 },
  { pair: "MATIC/USD", rate: 0.89, change24h: 0.56 },
  { pair: "SOL/USD", rate: 98.45, change24h: 3.12 },
];

export function LiveExchange() {
  const [rates, setRates] = useState<ExchangeRate[]>(INITIAL_RATES);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live price updates
      setRates((prev) =>
        prev.map((rate) => ({
          ...rate,
          rate: rate.rate * (1 + (Math.random() - 0.5) * 0.001),
          change24h: rate.change24h + (Math.random() - 0.5) * 0.1,
        }))
      );
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#111827]">Live Crypto Exchange</h3>
          <p className="text-xs text-text-secondary">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
      </div>

      <div className="space-y-3">
        {rates.map((rate, i) => {
          const isPositive = rate.change24h > 0;
          return (
            <motion.div
              key={rate.pair}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3"
            >
              <div>
                <p className="text-sm font-semibold text-[#111827]">{rate.pair}</p>
                <p className="text-xs text-text-secondary">24H Change</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#111827]">
                  ${rate.rate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p
                  className={`text-xs font-medium ${
                    isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {rate.change24h.toFixed(2)}%
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex-1 border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb]"
          onClick={() => alert("Opening exchange...")}
        >
          Trade
        </Button>
        <Button
          className="flex-1 bg-accent text-white hover:bg-[#1552b8]"
          onClick={() => alert("Transferring funds...")}
        >
          Transfer
        </Button>
      </div>
    </motion.div>
  );
}
