"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";

export function TransactionsChrome({ children }: { children: React.ReactNode }) {
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
          {children}
        </main>
      </div>
    </div>
  );
}
