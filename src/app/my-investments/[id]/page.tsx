"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import { fetchPlanDetail } from "@/services/plans/fetchPlanDetail";
import type { UserPlan } from "@/services/plans/types";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { PlanDetailView } from "@/components/MyInvestments";

export default function InvestmentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === "default") {
      const t = setTimeout(() => {
        setLoading(false);
        setPlan(null);
        setError(null);
      }, 0);
      return () => clearTimeout(t);
    }
    const uid = auth.currentUser?.uid;
    if (!uid) {
      const t = setTimeout(() => {
        setLoading(false);
        setError("Not signed in");
      }, 0);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    const doFetch = () => {
      fetchPlanDetail(uid, id)
        .then((result) => {
          if (cancelled) return;
          if (result.success) setPlan(result.plan);
          else setError(result.error);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load plan");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    const t = setTimeout(() => {
      setLoading(true);
      setError(null);
      doFetch();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [id]);

  const notFound = !loading && !plan && id !== "default";
  const isDefault = id === "default";

  if (isDefault) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb] dark:bg-[#0f0f0f]">
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
              className="mx-auto max-w-[560px] rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
            >
              <h1 className="text-xl font-bold text-[#111827] dark:text-[#f5f5f5]">Default plan</h1>
              <p className="mt-2 text-sm text-text-secondary dark:text-[#a3a3a3]">
                You haven&apos;t started an investment yet. Start with our default Starter plan to begin earning.
              </p>
              <Link
                href="/investments"
                className="mt-6 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
              >
                Start investment →
              </Link>
            </motion.div>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb] dark:bg-[#0f0f0f]">
        <DashboardSidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex flex-1 flex-col lg:ml-[280px]">
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto h-64 animate-pulse rounded-xl border border-[#e5e7eb] bg-white dark:border-[#2a2a2a] dark:bg-[#1a1a1a]" />
          </main>
        </div>
      </div>
    );
  }

  if (error || notFound) {
    return (
      <div className="flex min-h-screen bg-[#f9fafb] dark:bg-[#0f0f0f]">
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
              className="mx-auto max-w-[560px] rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
            >
              <h1 className="text-xl font-bold text-[#111827] dark:text-[#f5f5f5]">Investment not found</h1>
              <p className="mt-2 text-sm text-text-secondary dark:text-[#a3a3a3]">
                {error || "This investment may have been removed or the link is incorrect."}
              </p>
              <Link
                href="/my-investments"
                className="mt-6 inline-block text-sm font-semibold text-accent no-underline hover:text-[#1552b8] dark:hover:text-accent/90"
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
    <div className="flex min-h-screen bg-[#f9fafb] dark:bg-[#0f0f0f]">
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:ml-[280px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {plan && <PlanDetailView plan={plan} userId={auth.currentUser?.uid ?? null} />}
        </main>
      </div>
    </div>
  );
}
