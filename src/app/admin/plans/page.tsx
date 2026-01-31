"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useAllUsers } from "@/services/admin/useAllUsers";
import { fetchUserPlans } from "@/services/plans/fetchUserPlans";
import { createPlan } from "@/services/plans/createPlan";
import { deletePlan } from "@/services/plans/deletePlan";
import { addPlanProfit } from "@/services/plans/addPlanProfit";
import { usePlanTemplates } from "@/services/plans/usePlanTemplates";
import { createPlanTemplate } from "@/services/plans/createPlanTemplate";
import { updatePlanTemplate } from "@/services/plans/updatePlanTemplate";
import { deletePlanTemplate } from "@/services/plans/deletePlanTemplate";
import type { AdminUserSummary } from "@/services/admin/types";
import type { UserPlan, PlanTemplate } from "@/services/plans/types";

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

type TabKey = "users" | "templates";

export default function AdminPlansPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("users");

  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useAllUsers();
  const { templates, loading: templatesLoading, error: templatesError, refetch: refetchTemplates } = usePlanTemplates();

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

  const [templateName, setTemplateName] = useState("");
  const [templateMinAmount, setTemplateMinAmount] = useState("");
  const [templateExpectedReturn, setTemplateExpectedReturn] = useState("");
  const [templateReturnDays, setTemplateReturnDays] = useState("");
  const [templateSubmitting, setTemplateSubmitting] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [templateSuccess, setTemplateSuccess] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [disableUpdatingId, setDisableUpdatingId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<PlanTemplate | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinAmount, setEditMinAmount] = useState("");
  const [editExpectedReturn, setEditExpectedReturn] = useState("");
  const [editReturnDays, setEditReturnDays] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [draggedTemplateId, setDraggedTemplateId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [reorderSubmitting, setReorderSubmitting] = useState(false);

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

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = templateName.trim();
    const min = parseFloat(templateMinAmount);
    const expectedReturn = parseFloat(templateExpectedReturn);
    const returnDays = parseInt(templateReturnDays, 10);
    if (!name) {
      setTemplateError("Plan name is required");
      return;
    }
    if (!Number.isFinite(min) || min < 0) {
      setTemplateError("Enter a valid minimum amount");
      return;
    }
    if (!Number.isFinite(expectedReturn) || expectedReturn < 0) {
      setTemplateError("Enter a valid expected return amount ($)");
      return;
    }
    if (!Number.isInteger(returnDays) || returnDays < 0) {
      setTemplateError("Enter a valid number of days (0 or more)");
      return;
    }
    setTemplateError(null);
    setTemplateSubmitting(true);
    const result = await createPlanTemplate({ name, minAmount: min, expectedReturn, returnDays });
    setTemplateSubmitting(false);
    if (result.success) {
      setTemplateName("");
      setTemplateMinAmount("");
      setTemplateExpectedReturn("");
      setTemplateReturnDays("");
      setTemplateSuccess(true);
      setTimeout(() => setTemplateSuccess(false), 2400);
      await refetchTemplates();
    } else {
      setTemplateError(result.error ?? "Failed to create plan");
    }
  };

  const handleToggleDisabled = async (t: PlanTemplate) => {
    setDisableUpdatingId(t.id);
    await updatePlanTemplate(t.id, { disabled: !t.disabled });
    setDisableUpdatingId(null);
    await refetchTemplates();
  };

  const handleDeleteTemplate = async (templateId: string) => {
    setDeleteSubmitting(true);
    const result = await deletePlanTemplate(templateId);
    setDeleteSubmitting(false);
    if (result.success) {
      setDeleteTemplateId(null);
      await refetchTemplates();
    }
  };

  const openEditModal = (t: PlanTemplate) => {
    setEditingTemplate(t);
    setEditName(t.name);
    setEditMinAmount(String(t.minAmount));
    setEditExpectedReturn(String(t.expectedReturn));
    setEditReturnDays(String(t.returnDays));
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    const name = editName.trim();
    const min = parseFloat(editMinAmount);
    const expectedReturn = parseFloat(editExpectedReturn);
    const returnDays = parseInt(editReturnDays, 10);
    if (!name) {
      setEditError("Plan name is required");
      return;
    }
    if (!Number.isFinite(min) || min < 0) {
      setEditError("Enter a valid minimum amount");
      return;
    }
    if (!Number.isFinite(expectedReturn) || expectedReturn < 0) {
      setEditError("Enter a valid expected return amount ($)");
      return;
    }
    if (!Number.isInteger(returnDays) || returnDays < 0) {
      setEditError("Enter a valid number of days (0 or more)");
      return;
    }
    setEditError(null);
    setEditSubmitting(true);
    const result = await updatePlanTemplate(editingTemplate.id, {
      name,
      minAmount: min,
      expectedReturn,
      returnDays,
    });
    setEditSubmitting(false);
    if (result.success) {
      setEditingTemplate(null);
      await refetchTemplates();
    } else {
      setEditError(result.error ?? "Failed to update plan");
    }
  };

  const handleDragStart = (e: React.DragEvent, templateId: string) => {
    setDraggedTemplateId(templateId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", templateId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTemplateId(null);
    setDropTargetIndex(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedTemplateId) setDropTargetIndex(index);
  };

  const handleDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDropTargetIndex(null);
    const templateId = e.dataTransfer.getData("text/plain");
    if (!templateId || !draggedTemplateId || reorderSubmitting) return;
    const dragIndex = templates.findIndex((t) => t.id === templateId);
    if (dragIndex === -1 || dragIndex === dropIndex) {
      setDraggedTemplateId(null);
      return;
    }
    const reordered = [...templates];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, removed);
    setReorderSubmitting(true);
    try {
      await Promise.all(
        reordered.map((t, i) => updatePlanTemplate(t.id, { order: i }))
      );
      await refetchTemplates();
    } finally {
      setReorderSubmitting(false);
      setDraggedTemplateId(null);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "users", label: "Users with plans" },
    { key: "templates", label: "Plan templates" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">Plans</h1>
          <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
            Manage user investments and investment plan templates. Create, disable, or delete plans.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-1.5 dark:border-[#2a2a2a] dark:bg-[#262626]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === tab.key
                ? "bg-white text-accent shadow-sm dark:bg-[#1a1a1a] dark:text-accent"
                : "text-text-secondary hover:bg-white/60 hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:bg-[#404040] dark:hover:text-[#f5f5f5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "users" ? (
          <motion.div
            key="users-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {usersError && (
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                {usersError}
              </div>
            )}

            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary dark:text-[#a3a3a3]">
                Select user
              </h2>
              {usersLoading ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <span className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading users…</span>
                </div>
              ) : users.length === 0 ? (
                <p className="py-4 text-sm text-text-secondary dark:text-[#a3a3a3]">No users found. Only non-admin users are listed.</p>
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
                    className="min-w-[220px] rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  >
                    <option value="">Choose a user…</option>
                    {users.map((u) => (
                      <option key={u.uid} value={u.uid}>
                        {u.fullName || u.email || u.uid}
                      </option>
                    ))}
                  </select>
                  {selectedUser && (
                    <div className="flex items-center gap-2 rounded-lg bg-[#eef2ff] px-3 py-2 text-sm dark:bg-accent/20">
                      <span className="font-medium text-accent">{selectedUser.fullName || selectedUser.email || "User"}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setPlans([]);
                        }}
                        className="rounded p-1 text-text-secondary hover:bg-white/60 hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:bg-[#404040] dark:hover:text-[#f5f5f5]"
                        aria-label="Clear selection"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {!selectedUser ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafafa] py-16 text-center dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
                <div className="mb-3 rounded-full bg-[#f3f4f6] p-4 dark:bg-[#262626]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-[#9ca3af] dark:text-[#a3a3a3]">
                    <line x1="12" y1="20" x2="12" y2="10" />
                    <line x1="18" y1="20" x2="18" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="16" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Select a user to manage their plans</p>
                <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">Choose a user above to view investments and add plans or profits.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
                  <h2 className="mb-4 text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Add plan for {selectedUser.fullName || selectedUser.email || "user"}</h2>
                  {addSuccess && (
                    <div className="mb-4 rounded-lg border border-[#a7f3d0] bg-[#d1fae5] px-4 py-3 text-sm font-medium text-[#065f46] dark:border-[#064e3b] dark:bg-[#064e3b] dark:text-[#34d399]">
                      Plan created successfully.
                    </div>
                  )}
                  {addError && (
                    <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                      {addError}
                    </div>
                  )}
                  <form onSubmit={handleAddPlan} className="grid gap-4 sm:grid-cols-2 sm:items-end">
                    <div>
                      <label htmlFor="plan-name" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Plan name</label>
                      <input
                        id="plan-name"
                        type="text"
                        value={planName}
                        onChange={(e) => { setPlanName(e.target.value); if (addError) setAddError(null); }}
                        placeholder="e.g. Starter, Premium"
                        className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label htmlFor="plan-amount" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Amount ($)</label>
                      <input
                        id="plan-amount"
                        type="number"
                        min="0"
                        step="any"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); if (addError) setAddError(null); }}
                        placeholder="0.00"
                        className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
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
                </section>

                <section className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
                  <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 dark:border-[#2a2a2a] dark:bg-[#262626] sm:px-6">
                    <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Current plans</h2>
                    <p className="mt-0.5 text-sm text-text-secondary dark:text-[#a3a3a3]">{selectedUser.fullName || selectedUser.email}&apos;s investment plans</p>
                  </div>
                  {plansLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Loading plans…</p>
                    </div>
                  ) : plansError ? (
                    <div className="px-4 py-8 text-center text-sm text-[#b91c1c] dark:text-[#fca5a5] sm:px-6">{plansError}</div>
                  ) : plans.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">No plans yet for this user.</p>
                      <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">Add a plan using the form above.</p>
                    </div>
                  ) : (
                    <div className="table-scroll-wrap -mx-2 sm:mx-0">
                      <table className="w-full min-w-[440px]">
                        <thead>
                          <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase tracking-wider text-text-secondary dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#a3a3a3]">
                            <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Plan</th>
                            <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Amount</th>
                            <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Profit</th>
                            <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Date</th>
                            <th className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                          {plans.map((plan) => (
                            <tr key={plan.id} className="transition-colors hover:bg-[#fafafa] dark:hover:bg-[#262626]">
                              <td className="whitespace-nowrap px-3 py-3 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">{plan.planName}</td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">${plan.amount}</td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-4 sm:py-3.5 lg:px-6">
                                <span className="font-medium text-[#059669] dark:text-[#34d399]">
                                  ${(plan.totalProfit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-sm text-text-secondary dark:text-[#a3a3a3] sm:px-4 sm:py-3.5 lg:px-6">{formatDate(plan.date, plan.dateSortKey)}</td>
                              <td className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">
                                {deleteConfirmId === plan.id ? (
                                  <span className="flex items-center justify-end gap-2">
                                    <span className="text-xs text-[#6b7280] dark:text-[#a3a3a3]">Delete?</span>
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
                                      className="rounded border border-[#e5e7eb] bg-white px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                                    >
                                      No
                                    </button>
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openProfitModal(plan)}
                                      className="rounded px-3 py-1.5 text-sm font-medium text-[#059669] hover:bg-[#ecfdf5] dark:text-[#34d399] dark:hover:bg-[#064e3b]"
                                    >
                                      Add profit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirmId(plan.id)}
                                      className="rounded px-3 py-1.5 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#450a0a]"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <div className="flex justify-center">
                  <Link
                    href={`/admin/users/${encodeURIComponent(selectedUser.uid)}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                  >
                    View full user profile
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="templates-tab"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {templatesError && (
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                {templatesError}
              </div>
            )}

            <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
              <h2 className="mb-1 text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Create plan template</h2>
              <p className="mb-4 text-sm text-text-secondary dark:text-[#a3a3a3]">
                Add an investment plan type. Users will see these on the investments page. Disabled plans are hidden from users.
              </p>
              {templateSuccess && (
                <div className="mb-4 rounded-lg border border-[#a7f3d0] bg-[#d1fae5] px-4 py-3 text-sm font-medium text-[#065f46] dark:border-[#064e3b] dark:bg-[#064e3b] dark:text-[#34d399]">
                  Plan template created.
                </div>
              )}
              {templateError && (
                <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                  {templateError}
                </div>
              )}
              <form onSubmit={handleCreateTemplate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:items-end">
                <div>
                  <label htmlFor="template-name" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Plan name</label>
                  <input
                    id="template-name"
                    type="text"
                    value={templateName}
                    onChange={(e) => { setTemplateName(e.target.value); if (templateError) setTemplateError(null); }}
                    placeholder="e.g. Starter, Premium"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div>
                  <label htmlFor="template-min" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Minimum amount ($)</label>
                  <input
                    id="template-min"
                    type="number"
                    min="0"
                    step="any"
                    value={templateMinAmount}
                    onChange={(e) => { setTemplateMinAmount(e.target.value); if (templateError) setTemplateError(null); }}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div>
                  <label htmlFor="template-return" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Expected return ($)</label>
                  <input
                    id="template-return"
                    type="number"
                    min="0"
                    step="any"
                    value={templateExpectedReturn}
                    onChange={(e) => { setTemplateExpectedReturn(e.target.value); if (templateError) setTemplateError(null); }}
                    placeholder="e.g. 2000"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                  <p className="mt-1 text-xs text-text-secondary dark:text-[#a3a3a3]">Amount in dollars. % calculated from min.</p>
                </div>
                <div>
                  <label htmlFor="template-days" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Return in (days)</label>
                  <input
                    id="template-days"
                    type="number"
                    min="0"
                    step="1"
                    value={templateReturnDays}
                    onChange={(e) => { setTemplateReturnDays(e.target.value); if (templateError) setTemplateError(null); }}
                    placeholder="e.g. 3"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div className="sm:flex sm:items-end lg:col-span-4">
                  <button
                    type="submit"
                    disabled={templateSubmitting}
                    className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:opacity-60 sm:w-auto"
                  >
                    {templateSubmitting ? "Creating…" : "Create plan"}
                  </button>
                </div>
              </form>
            </section>

            <section className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
              <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 dark:border-[#2a2a2a] dark:bg-[#262626] sm:px-6">
                <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Plan templates</h2>
                <p className="mt-0.5 text-sm text-text-secondary dark:text-[#a3a3a3]">Drag rows to reorder. Edit or disable plans as needed.</p>
              </div>
              {templatesLoading || reorderSubmitting ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">{reorderSubmitting ? "Updating order…" : "Loading templates…"}</p>
                </div>
              ) : templates.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">No plan templates yet.</p>
                  <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">Create one above. Users will see hardcoded plans until you add templates.</p>
                </div>
              ) : (
                <div className="table-scroll-wrap -mx-2 sm:mx-0">
                  <table className="w-full min-w-[520px]">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-left text-xs font-semibold uppercase tracking-wider text-text-secondary dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#a3a3a3]">
                        <th className="w-10 shrink-0 px-2 py-3 sm:px-3" aria-label="Drag to reorder" />
                        <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Name</th>
                        <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Min amount</th>
                        <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Expected return</th>
                        <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Return in</th>
                        <th className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">Status</th>
                        <th className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#2a2a2a]">
                      {templates.map((t, index) => (
                        <tr
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`cursor-grab active:cursor-grabbing transition-colors hover:bg-[#fafafa] dark:hover:bg-[#262626] ${t.disabled ? "opacity-60" : ""} ${draggedTemplateId === t.id ? "opacity-50" : ""} ${dropTargetIndex === index ? "bg-[#eef2ff] ring-1 ring-inset ring-accent/30 dark:bg-accent/20" : ""}`}
                        >
                          <td
                            className="w-10 shrink-0 px-2 py-3 text-text-secondary dark:text-[#a3a3a3] sm:px-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="inline-flex cursor-grab active:cursor-grabbing touch-none" aria-hidden>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="8" y2="18" />
                                <line x1="16" y1="6" x2="16" y2="18" />
                              </svg>
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">{t.name}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">${t.minAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">
                            {t.expectedReturn > 0 && t.minAmount > 0
                              ? `$${t.expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })} (${Math.round((t.expectedReturn / t.minAmount) * 100)}%)`
                              : t.expectedReturn > 0
                                ? `$${t.expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                : "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-sm text-[#111827] dark:text-[#f5f5f5] sm:px-4 sm:py-3.5 lg:px-6">
                            {t.returnDays > 0 ? `${t.returnDays} day${t.returnDays === 1 ? "" : "s"}` : "—"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${t.disabled ? "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f] dark:text-[#fcd34d]" : "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]"}`}>
                              {t.disabled ? "Disabled" : "Active"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">
                            {deleteTemplateId === t.id ? (
                              <span className="flex items-center justify-end gap-2">
                                <span className="text-xs text-[#6b7280] dark:text-[#a3a3a3]">Delete template?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTemplate(t.id)}
                                  disabled={deleteSubmitting}
                                  className="rounded bg-[#dc2626] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#b91c1c] disabled:opacity-60"
                                >
                                  {deleteSubmitting ? "…" : "Yes"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTemplateId(null)}
                                  className="rounded border border-[#e5e7eb] bg-white px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                                >
                                  No
                                </button>
                              </span>
                            ) : (
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(t)}
                                  className="rounded px-3 py-1.5 text-sm font-medium text-accent hover:bg-[#eef2ff] dark:hover:bg-accent/20"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleDisabled(t)}
                                  disabled={disableUpdatingId === t.id}
                                  className={`rounded px-3 py-1.5 text-sm font-medium ${t.disabled ? "text-[#059669] hover:bg-[#ecfdf5] dark:text-[#34d399] dark:hover:bg-[#064e3b]" : "text-[#b45309] hover:bg-[#fffbeb] dark:text-[#fcd34d] dark:hover:bg-[#78350f]"}`}
                                >
                                  {disableUpdatingId === t.id ? "…" : t.disabled ? "Enable" : "Disable"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTemplateId(t.id)}
                                  className="rounded px-3 py-1.5 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#450a0a]"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => !profitSubmitting && setProfitPlanId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
            >
              <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Add profit</h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
                This amount will be added to the plan and appear in the client&apos;s transactions.
              </p>
              {profitSuccess && (
                <div className="mt-4 rounded-lg border border-[#a7f3d0] bg-[#d1fae5] px-4 py-3 text-sm font-medium text-[#065f46] dark:border-[#064e3b] dark:bg-[#064e3b] dark:text-[#34d399]">
                  Profit added successfully.
                </div>
              )}
              {profitError && (
                <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                  {profitError}
                </div>
              )}
              <form onSubmit={handleAddProfit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="profit-amount" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Amount ($)</label>
                  <input
                    id="profit-amount"
                    type="number"
                    min="0"
                    step="any"
                    value={profitAmount}
                    onChange={(e) => { setProfitAmount(e.target.value); if (profitError) setProfitError(null); }}
                    placeholder="0.00"
                    required
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !profitSubmitting && setProfitPlanId(null)}
                    disabled={profitSubmitting}
                    className="flex-1 rounded-lg border border-[#e5e7eb] bg-white py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profitSubmitting}
                    className="flex-1 rounded-lg bg-[#059669] py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 dark:bg-[#047857] dark:hover:bg-[#065f46]"
                  >
                    {profitSubmitting ? "Adding…" : "Add profit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit plan template modal */}
      <AnimatePresence>
        {editingTemplate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => !editSubmitting && setEditingTemplate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-[#111827] dark:text-[#f5f5f5]">Edit plan template</h2>
              <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
                Update name, minimum amount, expected return, or return days.
              </p>
              {editError && (
                <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
                  {editError}
                </div>
              )}
              <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Plan name</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => { setEditName(e.target.value); if (editError) setEditError(null); }}
                    placeholder="e.g. Starter, Premium"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-min" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Minimum amount ($)</label>
                  <input
                    id="edit-min"
                    type="number"
                    min="0"
                    step="any"
                    value={editMinAmount}
                    onChange={(e) => { setEditMinAmount(e.target.value); if (editError) setEditError(null); }}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-return" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Expected return ($)</label>
                  <input
                    id="edit-return"
                    type="number"
                    min="0"
                    step="any"
                    value={editExpectedReturn}
                    onChange={(e) => { setEditExpectedReturn(e.target.value); if (editError) setEditError(null); }}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-days" className="mb-1.5 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">Return in (days)</label>
                  <input
                    id="edit-days"
                    type="number"
                    min="0"
                    step="1"
                    value={editReturnDays}
                    onChange={(e) => { setEditReturnDays(e.target.value); if (editError) setEditError(null); }}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !editSubmitting && setEditingTemplate(null)}
                    disabled={editSubmitting}
                    className="flex-1 rounded-lg border border-[#e5e7eb] bg-white py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                  >
                    {editSubmitting ? "Saving…" : "Save changes"}
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
