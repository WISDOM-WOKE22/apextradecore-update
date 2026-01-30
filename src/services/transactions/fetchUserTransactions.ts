"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { DepositRecord, WithdrawalRecord, UnifiedTransaction } from "./types";
import type { PlanRecord } from "@/services/plans/types";

function parseDeposits(snapshot: { val: () => Record<string, DepositRecord> | null }): UnifiedTransaction[] {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return [];
  return Object.entries(val).map(([txId, data]) => {
    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const amountNum = parseFloat(amount) || 0;
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof data.createdAt === "number" && data.createdAt > 0
        ? data.createdAt
        : parseDbDateToMs(dateStr);
    return {
      kind: "deposit" as const,
      id: txId,
      amount,
      amountNum,
      date: dateStr,
      dateSortKey,
      status: normalizeStatus(data.status),
      asset: data.paymentMethod ?? "—",
      reference: data.transactionId ?? txId,
      record: data,
    };
  });
}

function parseWithdrawals(snapshot: { val: () => Record<string, WithdrawalRecord> | null }): UnifiedTransaction[] {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return [];
  return Object.entries(val).map(([timestampStr, data]) => {
    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const amountNum = parseFloat(amount) || 0;
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof data.createdAt === "number" && data.createdAt > 0
        ? data.createdAt
        : parseDbDateToMs(dateStr) || parseInt(timestampStr, 10) || 0;
    return {
      kind: "withdrawal" as const,
      id: timestampStr,
      amount,
      amountNum,
      date: dateStr,
      dateSortKey,
      status: normalizeStatus(data.status),
      asset: data.withdrawalMode ?? data.walletType ?? "—",
      reference: timestampStr,
      record: data,
    };
  });
}

function normalizeStatus(s: string): string {
  const lower = (s ?? "").toLowerCase();
  if (lower === "approved" || lower === "completed") return "completed";
  if (lower === "pending") return "pending";
  if (lower === "failed" || lower === "rejected") return "failed";
  return lower || "pending";
}

function parseInvestments(snapshot: { val: () => Record<string, PlanRecord> | null }): UnifiedTransaction[] {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return [];
  return Object.entries(val).map(([planKey, data]) => {
    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const amountNum = parseFloat(amount) || 0;
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof data.createdAt === "number" && data.createdAt > 0
        ? data.createdAt
        : parseDbDateToMs(dateStr);
    return {
      kind: "investment" as const,
      id: planKey,
      amount,
      amountNum,
      date: dateStr,
      dateSortKey,
      status: "active",
      asset: data.plan ?? "Starter",
      reference: planKey,
      record: data,
    };
  });
}

/** Parse "d-m-yyyy" or "dd-m-yyyy" to ms for sorting */
function parseDbDateToMs(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return 0;
  const [d, m, y] = parts;
  if (!y || !m) return 0;
  const date = new Date(y, m - 1, d);
  return date.getTime();
}

export interface FetchUserTransactionsResult {
  deposits: UnifiedTransaction[];
  withdrawals: UnifiedTransaction[];
  investments: UnifiedTransaction[];
  all: UnifiedTransaction[];
}

export async function fetchUserTransactions(userId: string): Promise<FetchUserTransactionsResult> {
  const [depositsSnap, withdrawalsSnap, plansSnap] = await Promise.all([
    get(ref(database, DB.userDeposits(userId))),
    get(ref(database, DB.userWithdrawals(userId))),
    get(ref(database, DB.userPlans(userId))),
  ]);

  const deposits = parseDeposits(depositsSnap);
  const withdrawals = parseWithdrawals(withdrawalsSnap);
  const investments = parseInvestments(plansSnap);

  const all: UnifiedTransaction[] = [...deposits, ...withdrawals, ...investments].sort(
    (a, b) => b.dateSortKey - a.dateSortKey
  );

  return { deposits, withdrawals, investments, all };
}
