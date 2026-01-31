"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { fetchUserDetail } from "@/services/admin/fetchUserDetail";
import { updateUserBalanceAdjustment } from "@/services/admin/updateUserBalanceAdjustment";
import type { AdminUserDetail } from "@/services/admin/types";
import { formatCurrency } from "@/store/useAppStore";

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  const styles: Record<string, string> = {
    completed: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    approved: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    active: "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e3a8a] dark:text-[#93c5fd]",
    pending: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f] dark:text-[#fcd34d]",
    failed: "bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]",
  };
  const style = styles[s] ?? "bg-[#f3f4f6] text-[#6b7280] dark:bg-[#404040] dark:text-[#a3a3a3]";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status || "Pending"}
    </span>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const uid = typeof params.uid === "string" ? decodeURIComponent(params.uid) : "";
  const [data, setData] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals" | "investments">("deposits");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceUpdating, setBalanceUpdating] = useState(false);
  const [balanceMessage, setBalanceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refetch = useCallback(() => {
    if (!uid) return;
    setLoading(true);
    fetchUserDetail(uid)
      .then((result) => {
        if (result.success) setData(result.data);
        else setError(result.error);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setError("Invalid user");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchUserDetail(uid)
      .then((result) => {
        if (cancelled) return;
        if (result.success) setData(result.data);
        else setError(result.error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [uid]);

  const handleBalanceAdjust = useCallback(
    async (delta: number) => {
      if (!uid || balanceUpdating) return;
      const amount = Math.abs(delta);
      if (amount <= 0 || !Number.isFinite(delta)) {
        setBalanceMessage({ type: "error", text: "Enter a valid positive amount." });
        return;
      }
      setBalanceMessage(null);
      setBalanceUpdating(true);
      const result = await updateUserBalanceAdjustment(uid, delta);
      setBalanceUpdating(false);
      if (result.success) {
        setBalanceAmount("");
        setBalanceMessage({
          type: "success",
          text: `Balance ${delta > 0 ? "increased" : "decreased"} by ${formatCurrency(amount)}.`,
        });
        refetch();
      } else {
        setBalanceMessage({ type: "error", text: result.error ?? "Update failed." });
      }
    },
    [uid, balanceUpdating, refetch]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading user…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
        <p className="text-[#b91c1c] dark:text-[#fca5a5]">{error ?? "User not found"}</p>
        <Link
          href="/admin/users"
          className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
        >
          ← Back to users
        </Link>
      </div>
    );
  }

  const { profile, accountBalance, totalDeposits, totalWithdrawals, totalInvested, totalProfits, deposits, withdrawals, investments } = data;
  const stats = [
    { label: "Current balance", value: accountBalance, format: true },
    { label: "Total deposits (approved)", value: totalDeposits, format: true },
    { label: "Total withdrawals (approved)", value: totalWithdrawals, format: true },
    { label: "Total invested", value: totalInvested, format: true },
    { label: "Total profits", value: totalProfits, format: true },
  ];

  const tabs = [
    { key: "deposits" as const, label: `Deposits (${deposits.length})` },
    { key: "withdrawals" as const, label: `Withdrawals (${withdrawals.length})` },
    { key: "investments" as const, label: `Investments (${investments.length})` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href="/admin/users"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to users
      </Link>

      <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">
          {profile.fullName || "User"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">{profile.email}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-text-secondary dark:text-[#a3a3a3]">Country</dt>
            <dd className="text-sm font-medium text-[#111827] dark:text-[#f5f5f5]">{profile.country || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-secondary dark:text-[#a3a3a3]">Phone</dt>
            <dd className="text-sm font-medium text-[#111827] dark:text-[#f5f5f5]">{profile.phoneNumber || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-secondary dark:text-[#a3a3a3]">Joined</dt>
            <dd className="text-sm font-medium text-[#111827] dark:text-[#f5f5f5]">{profile.date || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-secondary dark:text-[#a3a3a3]">User ID</dt>
            <dd className="truncate font-mono text-xs text-[#111827] dark:text-[#f5f5f5]">{profile.uid}</dd>
          </div>
        </dl>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
          >
            <p className="text-xs font-medium text-text-secondary dark:text-[#a3a3a3]">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-xl">
              {stat.format ? formatCurrency(stat.value) : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:p-6">
        <h2 className="text-sm font-semibold text-[#111827] dark:text-[#f5f5f5]">Adjust account balance</h2>
        <p className="mt-0.5 text-xs text-text-secondary dark:text-[#a3a3a3]">
          Add or subtract an amount from this user&apos;s balance. Changes apply immediately.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 sm:max-w-48">
            <label htmlFor="admin-balance-amount" className="sr-only">
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-[#a3a3a3]">
                $
              </span>
              <input
                id="admin-balance-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={balanceAmount}
                onChange={(e) => {
                  setBalanceAmount(e.target.value);
                  setBalanceMessage(null);
                }}
                disabled={balanceUpdating}
                className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2.5 pl-7 pr-3 text-sm text-[#111827] placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:placeholder:text-[#737373]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleBalanceAdjust(parseFloat(balanceAmount) || 0)}
              disabled={balanceUpdating || !balanceAmount.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#059669] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#047857] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#047857] dark:hover:bg-[#065f46]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add
            </button>
            <button
              type="button"
              onClick={() => handleBalanceAdjust(-(parseFloat(balanceAmount) || 0))}
              disabled={balanceUpdating || !balanceAmount.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14" />
              </svg>
              Subtract
            </button>
          </div>
        </div>
        {balanceMessage && (
          <p
            className={`mt-3 text-sm ${balanceMessage.type === "success" ? "text-[#059669] dark:text-[#34d399]" : "text-[#b91c1c] dark:text-[#fca5a5]"}`}
          >
            {balanceMessage.text}
          </p>
        )}
      </div>

      <div className="min-w-0 rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
        <div className="flex gap-1 border-b border-[#e5e7eb] p-1 dark:border-[#2a2a2a]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#eef2ff] text-accent dark:bg-accent/20"
                  : "text-text-secondary hover:bg-[#f9fafb] hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:bg-[#262626] dark:hover:text-[#f5f5f5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="table-scroll-wrap mx-0 sm:-mx-1">
          {activeTab === "deposits" && (
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#a3a3a3]">
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Date</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Amount</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Status</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Payment method</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-text-secondary dark:text-[#a3a3a3]">
                      No deposits
                    </td>
                  </tr>
                ) : (
                  deposits.map((d) => (
                    <tr key={d.id} className="hover:bg-[#f9fafb] dark:hover:bg-[#262626]">
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4">{d.date}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4">
                        ${d.amountStr}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 sm:px-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4">{d.paymentMethod}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">
                        <Link
                          href={`/admin/transactions/deposit/${encodeURIComponent(profile.uid)}/${encodeURIComponent(d.id)}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "withdrawals" && (
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#a3a3a3]">
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Date</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Amount</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Status</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Mode</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-text-secondary dark:text-[#a3a3a3]">
                      No withdrawals
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-[#f9fafb] dark:hover:bg-[#262626]">
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4">{w.date}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4">
                        ${w.amountStr}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 sm:px-4">
                        <StatusBadge status={w.status} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4">{w.withdrawalMode}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">
                        <Link
                          href={`/admin/transactions/withdrawal/${encodeURIComponent(profile.uid)}/${encodeURIComponent(w.id)}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "investments" && (
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#a3a3a3]">
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Date</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Amount</th>
                  <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Plan</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-text-secondary dark:text-[#a3a3a3]">
                      No investments
                    </td>
                  </tr>
                ) : (
                  investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#f9fafb] dark:hover:bg-[#262626]">
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4">{inv.date}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4">
                        ${inv.amountStr}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4">{inv.planName}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">
                        <Link
                          href={`/admin/transactions/investment/${encodeURIComponent(profile.uid)}/${encodeURIComponent(inv.id)}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
