"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { DepositRecord, WithdrawalRecord, UnifiedTransaction, ProfitRecord, InvestmentReturnRecord } from "./types";
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

function parseProfits(snapshot: { val: () => Record<string, ProfitRecord> | null }): UnifiedTransaction[] {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return [];
  return Object.entries(val).map(([profitId, data]) => {
    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const amountNum = parseFloat(amount) || 0;
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof data.createdAt === "number" && data.createdAt > 0 ? data.createdAt : parseDbDateToMs(dateStr);
    return {
      kind: "profit" as const,
      id: profitId,
      amount,
      amountNum,
      date: dateStr,
      dateSortKey,
      status: "credited",
      asset: data.planName ?? "—",
      reference: data.planId ?? profitId,
      record: data,
    };
  });
}

function parseInvestmentReturns(
  snapshot: { val: () => Record<string, InvestmentReturnRecord> | null }
): UnifiedTransaction[] {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return [];
  return Object.entries(val).map(([returnId, data]) => {
    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const amountNum = parseFloat(amount) || 0;
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof (data as { createdAt?: number }).createdAt === "number" && (data as { createdAt?: number }).createdAt! > 0
        ? (data as { createdAt?: number }).createdAt!
        : parseDbDateToMs(dateStr);
    return {
      kind: "investment_return" as const,
      id: returnId,
      amount,
      amountNum,
      date: dateStr,
      dateSortKey,
      status: "returned",
      asset: (data as { planName?: string }).planName ?? "—",
      reference: (data as { planKey?: string }).planKey ?? returnId,
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
  profits: UnifiedTransaction[];
  investmentReturns: UnifiedTransaction[];
  all: UnifiedTransaction[];
}

export async function fetchUserTransactions(userId: string): Promise<FetchUserTransactionsResult> {
  const [depositsSnap, withdrawalsSnap, plansSnap, profitsSnap, returnsSnap] = await Promise.all([
    get(ref(database, DB.userDeposits(userId))),
    get(ref(database, DB.userWithdrawals(userId))),
    get(ref(database, DB.userPlans(userId))),
    get(ref(database, DB.userProfits(userId))),
    get(ref(database, DB.userInvestmentReturns(userId))),
  ]);

  const deposits = parseDeposits(depositsSnap);
  const withdrawals = parseWithdrawals(withdrawalsSnap);
  const investments = parseInvestments(plansSnap);
  const profits = parseProfits(profitsSnap);
  const investmentReturns = parseInvestmentReturns(returnsSnap);

  const all: UnifiedTransaction[] = [
    ...deposits,
    ...withdrawals,
    ...investments,
    ...profits,
    ...investmentReturns,
  ].sort((a, b) => b.dateSortKey - a.dateSortKey);

  return { deposits, withdrawals, investments, profits, investmentReturns, all };
}
