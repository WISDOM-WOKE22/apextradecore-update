"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { UserWelcome } from "./UserWelcome";
import { DashboardStats } from "./DashboardStats";
import { TransactionChart } from "./TransactionChart";
import { LatestTransactions } from "./LatestTransactions";
import { InvestmentPortfolio } from "./InvestmentPortfolio";
import { TopStakingAssets } from "./TopStakingAssets";
import { LiveExchange } from "./LiveExchange";

export function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:ml-[280px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1400px]">
            {/* User & overview */}
            <UserWelcome />

            {/* Stats: Total balance, Current investments, Deposits, Withdrawals */}
            <div className="mb-8">
              <DashboardStats />
            </div>

            {/* Transaction chart + Latest transactions */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              <TransactionChart />
              <LatestTransactions />
            </div>

            {/* Investment portfolio by package */}
            <div className="mb-8">
              <InvestmentPortfolio />
            </div>

            {/* Secondary: Staking assets + Live exchange */}
            {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
              <TopStakingAssets />
              <LiveExchange />
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
