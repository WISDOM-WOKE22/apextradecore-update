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
    completed: "bg-[#d1fae5] text-[#059669]",
    approved: "bg-[#d1fae5] text-[#059669]",
    active: "bg-[#dbeafe] text-[#1d4ed8]",
    pending: "bg-[#fef3c7] text-[#b45309]",
    failed: "bg-[#fee2e2] text-[#dc2626]",
  };
  const style = styles[s] ?? "bg-[#f3f4f6] text-[#6b7280]";
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
        <p className="text-sm text-text-secondary">Loading user…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm">
        <p className="text-[#b91c1c]">{error ?? "User not found"}</p>
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
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to users
      </Link>

      <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
          {profile.fullName || "User"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{profile.email}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-text-secondary">Country</dt>
            <dd className="text-sm font-medium text-[#111827]">{profile.country || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-secondary">Phone</dt>
            <dd className="text-sm font-medium text-[#111827]">{profile.phoneNumber || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-secondary">Joined</dt>
            <dd className="text-sm font-medium text-[#111827]">{profile.date || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-secondary">User ID</dt>
            <dd className="truncate font-mono text-xs text-[#111827]">{profile.uid}</dd>
          </div>
        </dl>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-[#111827] sm:text-xl">
              {stat.format ? formatCurrency(stat.value) : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold text-[#111827]">Adjust account balance</h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          Add or subtract an amount from this user&apos;s balance. Changes apply immediately.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 sm:max-w-48">
            <label htmlFor="admin-balance-amount" className="sr-only">
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
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
                className="w-full rounded-lg border border-[#e5e7eb] py-2.5 pl-7 pr-3 text-sm text-[#111827] placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleBalanceAdjust(parseFloat(balanceAmount) || 0)}
              disabled={balanceUpdating || !balanceAmount.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#059669] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#047857] disabled:pointer-events-none disabled:opacity-50"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-50"
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
            className={`mt-3 text-sm ${balanceMessage.type === "success" ? "text-[#059669]" : "text-[#b91c1c]"}`}
          >
            {balanceMessage.text}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex gap-1 border-b border-[#e5e7eb] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#eef2ff] text-accent"
                  : "text-text-secondary hover:bg-[#f9fafb] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto p-4 sm:p-6">
          {activeTab === "deposits" && (
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Payment method</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-text-secondary">
                      No deposits
                    </td>
                  </tr>
                ) : (
                  deposits.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2.5 text-sm text-[#111827]">{d.date}</td>
                      <td className="py-2.5 font-medium text-[#111827]">
                        ${d.amountStr}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="py-2.5 text-sm text-text-secondary">{d.paymentMethod}</td>
                      <td className="py-2.5 text-right">
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
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Mode</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-text-secondary">
                      No withdrawals
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="py-2.5 text-sm text-[#111827]">{w.date}</td>
                      <td className="py-2.5 font-medium text-[#111827]">
                        ${w.amountStr}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={w.status} />
                      </td>
                      <td className="py-2.5 text-sm text-text-secondary">{w.withdrawalMode}</td>
                      <td className="py-2.5 text-right">
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
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase text-text-secondary">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Plan</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-text-secondary">
                      No investments
                    </td>
                  </tr>
                ) : (
                  investments.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-2.5 text-sm text-[#111827]">{inv.date}</td>
                      <td className="py-2.5 font-medium text-[#111827]">
                        ${inv.amountStr}
                      </td>
                      <td className="py-2.5 text-sm text-text-secondary">{inv.planName}</td>
                      <td className="py-2.5 text-right">
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
    </motion.div>
  );
}
