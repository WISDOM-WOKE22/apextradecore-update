"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { fetchAdminTransactionDetail } from "@/services/admin/fetchAdminTransactionDetail";
import { updateDepositStatus, updateWithdrawalStatus } from "@/services/admin/updateTransactionStatus";
import type { AdminTransactionDetail, AdminTransactionKind } from "@/services/admin/types";
import type { DepositRecord, WithdrawalRecord } from "@/services/transactions/types";
import type { PlanRecord } from "@/services/plans/types";

function formatTransactionDate(record: DepositRecord | WithdrawalRecord | PlanRecord): string {
  const r = record as { createdAt?: number; date?: string };
  if (typeof r.createdAt === "number" && r.createdAt > 0) {
    return new Date(r.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return (r.date as string) ?? "—";
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status ?? "").toLowerCase();
  const styles: Record<string, string> = {
    completed: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    approved: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    active: "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e3a8a] dark:text-[#93c5fd]",
    pending: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f] dark:text-[#fcd34d]",
    failed: "bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]",
    rejected: "bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]",
  };
  const style = styles[normalized] ?? "bg-[#f3f4f6] text-[#6b7280] dark:bg-[#404040] dark:text-[#a3a3a3]";
  const label = normalized === "approved" ? "Approved" : (status ?? "Pending");
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <>
      <dt className="text-sm font-medium text-text-secondary dark:text-[#a3a3a3]">{label}</dt>
      <dd className={`text-sm font-medium text-[#111827] dark:text-[#f5f5f5] ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </>
  );
}

function DetailContent({
  data,
  onApprove,
  onReject,
  actionLoading,
}: {
  data: AdminTransactionDetail;
  onApprove?: () => void;
  onReject?: () => void;
  actionLoading: boolean;
}) {
  const canAct = data.kind === "deposit" || data.kind === "withdrawal";
  const status = (data.record as { status?: string }).status ?? "";
  const isPending = (status ?? "").toLowerCase() === "pending";

  if (data.kind === "deposit") {
    const r = data.record;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-full space-y-6 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-4 dark:border-[#2a2a2a]">
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#f5f5f5]">Deposit details</h1>
          <StatusBadge status={r.status} />
        </div>
        <dl className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <DetailRow label="Transaction ID" value={r.transactionId ?? data.id} mono />
          <DetailRow label="Amount" value={r.amount} />
          <DetailRow label="Date" value={formatTransactionDate(r)} />
          <DetailRow label="Payment method" value={r.paymentMethod} />
          <DetailRow label="Type" value={r.type} />
          <DetailRow label="User ID" value={data.userId} mono />
          {r.paymentProofURL && (
            <DetailRow
              label="Proof of payment"
              value={
                <a
                  href={r.paymentProofURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline hover:no-underline"
                >
                  View proof
                </a>
              }
            />
          )}
        </dl>
        {canAct && isPending && (
          <div className="flex flex-wrap gap-3 border-t border-[#e5e7eb] pt-4 dark:border-[#2a2a2a]">
            <button
              type="button"
              onClick={onApprove}
              disabled={actionLoading}
              className="rounded-lg bg-[#059669] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#047857] disabled:opacity-60 dark:bg-[#047857] dark:hover:bg-[#065f46]"
            >
              {actionLoading ? "Updating…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={actionLoading}
              className="rounded-lg border border-[#dc2626] bg-white px-4 py-2.5 text-sm font-medium text-[#dc2626] transition-colors hover:bg-[#fef2f2] disabled:opacity-60 dark:border-[#f87171] dark:bg-[#262626] dark:text-[#fca5a5] dark:hover:bg-[#450a0a]"
            >
              Reject
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  if (data.kind === "withdrawal") {
    const r = data.record;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-full space-y-6 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-4 dark:border-[#2a2a2a]">
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#f5f5f5]">Withdrawal details</h1>
          <StatusBadge status={r.status} />
        </div>
        <dl className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <DetailRow label="Reference" value={data.id} mono />
          <DetailRow label="Amount" value={r.amount} />
          <DetailRow label="Date" value={formatTransactionDate(r)} />
          <DetailRow label="Withdrawal mode" value={r.withdrawalMode} />
          <DetailRow label="Wallet type" value={r.walletType} />
          <DetailRow label="User ID" value={data.userId} mono />
          {r.narration && <DetailRow label="Narration" value={r.narration} />}
        </dl>
        {canAct && isPending && (
          <div className="flex flex-wrap gap-3 border-t border-[#e5e7eb] pt-4 dark:border-[#2a2a2a]">
            <button
              type="button"
              onClick={onApprove}
              disabled={actionLoading}
              className="rounded-lg bg-[#059669] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#047857] disabled:opacity-60 dark:bg-[#047857] dark:hover:bg-[#065f46]"
            >
              {actionLoading ? "Updating…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={actionLoading}
              className="rounded-lg border border-[#dc2626] bg-white px-4 py-2.5 text-sm font-medium text-[#dc2626] transition-colors hover:bg-[#fef2f2] disabled:opacity-60 dark:border-[#f87171] dark:bg-[#262626] dark:text-[#fca5a5] dark:hover:bg-[#450a0a]"
            >
              Reject
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  const r = data.record as PlanRecord;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-full space-y-6 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-4 dark:border-[#2a2a2a]">
        <h1 className="text-xl font-bold text-[#111827] dark:text-[#f5f5f5]">Investment details</h1>
        <StatusBadge status="active" />
      </div>
      <dl className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <DetailRow label="Plan" value={r.plan} />
        <DetailRow label="Amount" value={r.amount} />
        <DetailRow label="Date" value={formatTransactionDate(r)} />
        <DetailRow label="User ID" value={data.userId} mono />
      </dl>
    </motion.div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-4 rounded-xl border border-[#e5e7eb] bg-white p-6 dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
      <div className="h-6 w-1/3 rounded bg-[#f3f4f6] dark:bg-[#262626]" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between gap-4">
            <div className="h-4 w-24 rounded bg-[#f3f4f6] dark:bg-[#262626]" />
            <div className="h-4 flex-1 rounded bg-[#f3f4f6] dark:bg-[#262626]" />
          </div>
        ))}
      </div>
    </div>
  );
}

const VALID_TYPES: AdminTransactionKind[] = ["deposit", "withdrawal", "investment"];

export default function AdminTransactionDetailPage() {
  const params = useParams<{ type: string; userId: string; id: string }>();
  const router = useRouter();
  const type = (params?.type ?? "") as AdminTransactionKind;
  const userId = params?.userId ?? "";
  const id = params?.id ?? "";

  const [data, setData] = useState<AdminTransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!type || !userId || !id || !VALID_TYPES.includes(type)) {
      setLoading(false);
      setError("Invalid transaction");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetchAdminTransactionDetail(userId, type, id);
    setLoading(false);
    if (result.success) setData(result.data);
    else setError(result.error);
  }, [type, userId, id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleApprove = async () => {
    if (!data || (data.kind !== "deposit" && data.kind !== "withdrawal")) return;
    setActionLoading(true);
    setActionError(null);
    const result =
      data.kind === "deposit"
        ? await updateDepositStatus(data.userId, data.id, "approve")
        : await updateWithdrawalStatus(data.userId, data.id, "approve");
    setActionLoading(false);
    if (result.success) {
      await loadDetail();
      router.refresh();
    } else {
      setActionError(result.error ?? "Failed to approve");
    }
  };

  const handleReject = async () => {
    if (!data || (data.kind !== "deposit" && data.kind !== "withdrawal")) return;
    setActionLoading(true);
    setActionError(null);
    const result =
      data.kind === "deposit"
        ? await updateDepositStatus(data.userId, data.id, "reject")
        : await updateWithdrawalStatus(data.userId, data.id, "reject");
    setActionLoading(false);
    if (result.success) {
      await loadDetail();
      router.refresh();
    } else {
      setActionError(result.error ?? "Failed to reject");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto">
        <Link
          href="/admin/transactions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to transactions
        </Link>
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto">
        <Link
          href="/admin/transactions"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to transactions
        </Link>
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <p className="text-[#b91c1c] dark:text-[#fca5a5]">{error ?? "Transaction not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href="/admin/transactions"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to transactions
      </Link>

      {actionError && (
        <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c] dark:border-[#7f1d1d] dark:bg-[#450a0a] dark:text-[#fca5a5]">
          {actionError}
        </div>
      )}

      <AnimatePresence mode="wait">
        <DetailContent
          data={data}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
      </AnimatePresence>
    </motion.div>
  );
}
