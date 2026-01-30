"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useAllUsers } from "@/services/admin/useAllUsers";
import { fetchUserPlans } from "@/services/plans/fetchUserPlans";
import { createPlan } from "@/services/plans/createPlan";
import { deletePlan } from "@/services/plans/deletePlan";
import { addPlanProfit } from "@/services/plans/addPlanProfit";
import type { AdminUserSummary } from "@/services/admin/types";
import type { UserPlan } from "@/services/plans/types";

function formatDate(dateStr: string, dateSortKey: number): string {
  if (dateSortKey > 0) {
    return new Date(dateSortKey).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return dateStr || "—";
}

export default function AdminPlansPage() {
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useAllUsers();
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);

  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [profitPlanId, setProfitPlanId] = useState<string | null>(null);
  const [profitAmount, setProfitAmount] = useState("");
  const [profitSubmitting, setProfitSubmitting] = useState(false);
  const [profitError, setProfitError] = useState<string | null>(null);
  const [profitSuccess, setProfitSuccess] = useState(false);

  const loadPlans = useCallback(async (uid: string) => {
    setPlansLoading(true);
    setPlansError(null);
    try {
      const result = await fetchUserPlans(uid);
      setPlans(result.plans);
    } catch (err) {
      setPlansError(err instanceof Error ? err.message : "Failed to load plans");
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setPlans([]);
      setPlansError(null);
      return;
    }
    loadPlans(selectedUser.uid);
  }, [selectedUser, loadPlans]);

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const name = planName.trim();
    const amt = amount.trim();
    if (!name) {
      setAddError("Plan name is required");
      return;
    }
    if (!amt || Number.isNaN(Number(amt)) || Number(amt) <= 0) {
      setAddError("Enter a valid amount");
      return;
    }
    setAddError(null);
    setAddSubmitting(true);
    const result = await createPlan({
      userId: selectedUser.uid,
      planName: name,
      amount: amt,
    });
    setAddSubmitting(false);
    if (result.success) {
      setPlanName("");
      setAmount("");
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2400);
      await loadPlans(selectedUser.uid);
    } else {
      setAddError(result.error ?? "Failed to create plan");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!selectedUser) return;
    setDeleteSubmitting(true);
    const result = await deletePlan(selectedUser.uid, planId);
    setDeleteSubmitting(false);
    if (result.success) {
      setDeleteConfirmId(null);
      await loadPlans(selectedUser.uid);
    }
  };

  const handleAddProfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !profitPlanId) return;
    setProfitError(null);
    setProfitSubmitting(true);
    const result = await addPlanProfit({
      userId: selectedUser.uid,
      planId: profitPlanId,
      amount: profitAmount.trim(),
    });
    setProfitSubmitting(false);
    if (result.success) {
      setProfitPlanId(null);
      setProfitAmount("");
      setProfitSuccess(true);
      setTimeout(() => setProfitSuccess(false), 2400);
      await loadPlans(selectedUser.uid);
    } else {
      setProfitError(result.error ?? "Failed to add profit");
    }
  };

  const openProfitModal = (plan: UserPlan) => {
    setProfitPlanId(plan.id);
    setProfitAmount("");
    setProfitError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Plans</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Create and manage investment plans per user. Each user has their own set of plans.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetchUsers()}
          disabled={usersLoading}
          className="self-start rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60"
        >
          {usersLoading ? "Refreshing…" : "Refresh users"}
        </button>
      </div>

      {usersError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
        >
          {usersError}
        </motion.div>
      )}

      {/* User selector */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mb-8 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
      >
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Select user
        </h2>
        {usersLoading ? (
          <div className="flex items-center gap-3 py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-sm text-text-secondary">Loading users…</span>
          </div>
        ) : users.length === 0 ? (
          <p className="py-4 text-sm text-text-secondary">No users found. Only non-admin users are listed.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedUser?.uid ?? ""}
              onChange={(e) => {
                const uid = e.target.value;
                setSelectedUser(users.find((u) => u.uid === uid) ?? null);
                setAddError(null);
                setAddSuccess(false);
                setDeleteConfirmId(null);
              }}
              className="min-w-[220px] rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="">Choose a user…</option>
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.fullName || u.email || u.uid}
                </option>
              ))}
            </select>
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-lg bg-[#eef2ff] px-3 py-2 text-sm"
              >
                <span className="font-medium text-accent">{selectedUser.fullName || selectedUser.email || "User"}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setPlans([]);
                  }}
                  className="rounded p-1 text-text-secondary hover:bg-white/60 hover:text-[#111827]"
                  aria-label="Clear selection"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            )}
          </div>
        )}
      </motion.section>

      <AnimatePresence mode="wait">
        {!selectedUser ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafafa] py-16 text-center"
          >
            <div className="mb-3 rounded-full bg-[#f3f4f6] p-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="mx-auto">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#374151]">Select a user to manage plans</p>
            <p className="mt-1 text-sm text-text-secondary">Choose a user above to view their investment plans and add new ones.</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* Add plan form */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            >
              <h2 className="mb-4 text-lg font-bold text-[#111827]">Add plan for {selectedUser.fullName || selectedUser.email || "user"}</h2>
              <AnimatePresence>
                {addSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 rounded-lg border border-[#a7f3d0] bg-[#d1fae5] px-4 py-3 text-sm font-medium text-[#065f46]"
                  >
                    Plan created successfully.
                  </motion.div>
                )}
              </AnimatePresence>
              {addError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
                >
                  {addError}
                </motion.div>
              )}
              <form onSubmit={handleAddPlan} className="grid gap-4 sm:grid-cols-2 sm:items-end">
                <div>
                  <label htmlFor="plan-name" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Plan name
                  </label>
                  <input
                    id="plan-name"
                    type="text"
                    value={planName}
                    onChange={(e) => {
                      setPlanName(e.target.value);
                      if (addError) setAddError(null);
                    }}
                    placeholder="e.g. Starter, Premium"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label htmlFor="plan-amount" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Amount ($)
                  </label>
                  <input
                    id="plan-amount"
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (addError) setAddError(null);
                    }}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div className="sm:flex sm:items-end">
                  <button
                    type="submit"
                    disabled={addSubmitting}
                    className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:opacity-60 sm:w-auto"
                  >
                    {addSubmitting ? "Adding…" : "Add plan"}
                  </button>
                </div>
              </form>
            </motion.section>

            {/* Plans list */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm"
            >
              <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 sm:px-6">
                <h2 className="text-lg font-bold text-[#111827]">Current plans</h2>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {selectedUser.fullName || selectedUser.email}&apos;s investment plans
                </p>
              </div>
              {plansLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <p className="text-sm text-text-secondary">Loading plans…</p>
                </div>
              ) : plansError ? (
                <div className="px-4 py-8 text-center text-sm text-[#b91c1c] sm:px-6">
                  {plansError}
                </div>
              ) : plans.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-text-secondary">No plans yet for this user.</p>
                  <p className="mt-1 text-sm text-text-secondary">Add a plan using the form above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        <th className="px-4 py-3.5 sm:px-6">Plan</th>
                        <th className="px-4 py-3.5 sm:px-6">Amount</th>
                        <th className="px-4 py-3.5 sm:px-6">Profit</th>
                        <th className="px-4 py-3.5 sm:px-6">Date</th>
                        <th className="px-4 py-3.5 text-right sm:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                      {plans.map((plan, i) => (
                        <motion.tr
                          key={plan.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: 0.03 * i }}
                          className="transition-colors hover:bg-[#fafafa]"
                        >
                          <td className="px-4 py-3.5 font-medium text-[#111827] sm:px-6">
                            {plan.planName}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-[#111827] sm:px-6">
                            ${plan.amount}
                          </td>
                          <td className="px-4 py-3.5 text-sm sm:px-6">
                            <span className="font-medium text-[#059669]">
                              ${(plan.totalProfit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">
                            {formatDate(plan.date, plan.dateSortKey)}
                          </td>
                          <td className="px-4 py-3.5 text-right sm:px-6">
                            {deleteConfirmId === plan.id ? (
                              <span className="flex items-center justify-end gap-2">
                                <span className="text-xs text-[#6b7280]">Delete?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePlan(plan.id)}
                                  disabled={deleteSubmitting}
                                  className="rounded bg-[#dc2626] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#b91c1c] disabled:opacity-60"
                                >
                                  {deleteSubmitting ? "…" : "Yes"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="rounded border border-[#e5e7eb] bg-white px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]"
                                >
                                  No
                                </button>
                              </span>
                            ) : (
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openProfitModal(plan)}
                                  className="rounded px-3 py-1.5 text-sm font-medium text-[#059669] hover:bg-[#ecfdf5]"
                                >
                                  Add profit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(plan.id)}
                                  className="rounded px-3 py-1.5 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <Link
                href={`/admin/users/${encodeURIComponent(selectedUser.uid)}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                View full user profile
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add profit modal */}
      <AnimatePresence>
        {profitPlanId && selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => !profitSubmitting && setProfitPlanId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold text-[#111827]">Add profit</h2>
              <p className="mt-1 text-sm text-text-secondary">
                This amount will be added to the plan and appear in the client&apos;s transactions.
              </p>
              <AnimatePresence>
                {profitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 rounded-lg border border-[#a7f3d0] bg-[#d1fae5] px-4 py-3 text-sm font-medium text-[#065f46]"
                  >
                    Profit added successfully.
                  </motion.div>
                )}
              </AnimatePresence>
              {profitError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
                >
                  {profitError}
                </motion.div>
              )}
              <form onSubmit={handleAddProfit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="profit-amount" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Amount ($)
                  </label>
                  <input
                    id="profit-amount"
                    type="number"
                    min="0"
                    step="any"
                    value={profitAmount}
                    onChange={(e) => {
                      setProfitAmount(e.target.value);
                      if (profitError) setProfitError(null);
                    }}
                    placeholder="0.00"
                    required
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !profitSubmitting && setProfitPlanId(null)}
                    disabled={profitSubmitting}
                    className="flex-1 rounded-lg border border-[#e5e7eb] bg-white py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profitSubmitting}
                    className="flex-1 rounded-lg bg-[#059669] py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                  >
                    {profitSubmitting ? "Adding…" : "Add profit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
