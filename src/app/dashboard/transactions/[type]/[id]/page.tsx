"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "@/lib/firebase";
import { fetchTransactionDetail } from "@/services/transactions/fetchTransactionDetail";
import type { TransactionKind } from "@/services/transactions/types";
import type { DepositRecord, WithdrawalRecord } from "@/services/transactions/types";
import type { TransactionDetail } from "@/services/transactions/fetchTransactionDetail";

function formatTransactionDate(record: DepositRecord | WithdrawalRecord): string {
  if (typeof record.createdAt === "number" && record.createdAt > 0) {
    return new Date(record.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return record.date;
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

function StatusBadge({ status }: { status: string }) {
  const normalized = (status ?? "").toLowerCase();
  const styles: Record<string, string> = {
    completed: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    approved: "bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]",
    pending: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f] dark:text-[#fcd34d]",
    failed: "bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]",
  };
  const style = styles[normalized] ?? "bg-[#f3f4f6] text-[#6b7280] dark:bg-[#404040] dark:text-[#a3a3a3]";
  const label = normalized === "approved" ? "Approved" : (status ?? "Pending");
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}

function DetailContent({ data }: { data: TransactionDetail }) {
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
      </motion.div>
    );
  }

  const r = data.record;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl space-y-6 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
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
        {r.narration && <DetailRow label="Narration" value={r.narration} />}
      </dl>
    </motion.div>
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

export default function TransactionDetailPage() {
  const params = useParams<{ type: string; id: string }>();
  const [detail, setDetail] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const type = (params?.type ?? "") as TransactionKind;
  const id = params?.id ?? "";

  useEffect(() => {
    if (!type || !id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      setError("Invalid transaction");
      return;
    }
    if (type !== "deposit" && type !== "withdrawal") {
      setLoading(false);
      setError("Invalid transaction type");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError("You must be signed in to view this transaction");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTransactionDetail(user.uid, type, decodeURIComponent(id))
      .then((result) => {
        if (cancelled) return;
        if (result.success) setDetail(result.data);
        else setError(result.error);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load transaction");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to transactions
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading && <DetailSkeleton />}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-2xl rounded-xl border border-[#fecaca] bg-[#fef2f2] p-6 text-center dark:border-[#7f1d1d] dark:bg-[#450a0a]"
          >
            <p className="text-sm text-[#b91c1c] dark:text-[#fca5a5]">{error}</p>
            <Link
              href="/dashboard/transactions"
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              Back to transactions
            </Link>
          </motion.div>
        )}
        {!loading && !error && detail && <DetailContent data={detail} />}
      </AnimatePresence>
    </div>
  );
}
