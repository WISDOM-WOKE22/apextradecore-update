"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { AdminTransactionKind } from "./types";
import type { DepositRecord, WithdrawalRecord } from "@/services/transactions/types";
import type { PlanRecord } from "@/services/plans/types";

export type AdminTransactionDetail =
  | { kind: "deposit"; id: string; userId: string; record: DepositRecord }
  | { kind: "withdrawal"; id: string; userId: string; record: WithdrawalRecord }
  | { kind: "investment"; id: string; userId: string; record: PlanRecord };

export type FetchAdminTransactionDetailResult =
  | { success: true; data: AdminTransactionDetail }
  | { success: false; error: string };

export async function fetchAdminTransactionDetail(
  userId: string,
  type: AdminTransactionKind,
  id: string
): Promise<FetchAdminTransactionDetailResult> {
  try {
    const decodedId = decodeURIComponent(id);
    if (type === "deposit") {
      const path = DB.userDeposit(userId, decodedId);
      const snap = await get(ref(database, path));
      const record = snap.val() as DepositRecord | null;
      if (!record) return { success: false, error: "Deposit not found" };
      return { success: true, data: { kind: "deposit", id: decodedId, userId, record } };
    }
    if (type === "withdrawal") {
      const path = DB.userWithdrawal(userId, decodedId);
      const snap = await get(ref(database, path));
      const record = snap.val() as WithdrawalRecord | null;
      if (!record) return { success: false, error: "Withdrawal not found" };
      return { success: true, data: { kind: "withdrawal", id: decodedId, userId, record } };
    }
    if (type === "investment") {
      const path = DB.userPlan(userId, decodedId);
      const snap = await get(ref(database, path));
      const record = snap.val() as PlanRecord | null;
      if (!record) return { success: false, error: "Investment not found" };
      return { success: true, data: { kind: "investment", id: decodedId, userId, record } };
    }
    return { success: false, error: "Invalid transaction type" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load transaction";
    return { success: false, error: message };
  }
}
