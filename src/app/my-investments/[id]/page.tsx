"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { InvestmentDetailView } from "@/components/MyInvestments";
import { getInvestmentById } from "@/data/myInvestments";
import { motion } from "motion/react";
import { useState } from "react";

export default function InvestmentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const investment = getInvestmentById(id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!investment) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb]">
        <DashboardSidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex flex-1 flex-col lg:ml-[280px]">
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-[560px] rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm"
            >
              <h1 className="text-xl font-bold text-[#111827]">Investment not found</h1>
              <p className="mt-2 text-sm text-text-secondary">
                This investment may have been removed or the link is incorrect.
              </p>
              <Link
                href="/my-investments"
                className="mt-6 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
              >
                ← Back to my investments
              </Link>
            </motion.div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:ml-[280px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <InvestmentDetailView investment={investment} />
        </main>
      </div>
    </div>
  );
}
