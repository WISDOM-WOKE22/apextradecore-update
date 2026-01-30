"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { UserPlan } from "./types";
import type { ProfitRecord } from "@/services/transactions/types";

export type PlanTransactionType = "investment" | "profit";

export interface PlanTransaction {
  type: PlanTransactionType;
  id: string;
  dateSortKey: number;
  date: string;
  amount: string;
  amountNum: number;
  label: string;
}

function formatDateStr(dateSortKey: number): string {
  if (dateSortKey <= 0) return "—";
  return new Date(dateSortKey).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface FetchPlanTransactionsResult {
  transactions: PlanTransaction[];
  error?: string;
}

/** Fetches all transactions for a specific plan: the initial investment + all profit credits. */
export async function fetchPlanTransactions(
  userId: string,
  planId: string,
  plan: UserPlan
): Promise<FetchPlanTransactionsResult> {
  try {
    const investmentRow: PlanTransaction = {
      type: "investment",
      id: plan.id,
      dateSortKey: plan.dateSortKey,
      date: formatDateStr(plan.dateSortKey),
      amount: plan.amount,
      amountNum: plan.amountNum,
      label: "Investment",
    };

    const profitsSnap = await get(ref(database, DB.userProfits(userId)));
    const profitsVal = profitsSnap.val() as Record<string, ProfitRecord> | null;
    const profitRows: PlanTransaction[] = [];

    if (profitsVal && typeof profitsVal === "object") {
      for (const [profitId, data] of Object.entries(profitsVal)) {
        if (!data || data.planId !== planId) continue;
        const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
        const amountNum = parseFloat(amount) || 0;
        const dateSortKey =
          typeof data.createdAt === "number" && data.createdAt > 0
            ? data.createdAt
            : 0;
        profitRows.push({
          type: "profit",
          id: profitId,
          dateSortKey,
          date: formatDateStr(dateSortKey),
          amount,
          amountNum,
          label: "Profit",
        });
      }
    }

    const transactions = [investmentRow, ...profitRows].sort(
      (a, b) => b.dateSortKey - a.dateSortKey
    );

    return { transactions };
  } catch (err) {
    console.error("[fetchPlanTransactions]", err);
    return {
      transactions: [],
      error: err instanceof Error ? err.message : "Failed to load plan transactions",
    };
  }
}
