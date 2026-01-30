"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { DepositRecord, WithdrawalRecord, TransactionKind } from "./types";

export type TransactionDetail =
  | { kind: "deposit"; id: string; record: DepositRecord }
  | { kind: "withdrawal"; id: string; record: WithdrawalRecord };

export type FetchDetailResult =
  | { success: true; data: TransactionDetail }
  | { success: false; error: string };

export async function fetchTransactionDetail(
  userId: string,
  type: TransactionKind,
  id: string
): Promise<FetchDetailResult> {
  try {
    if (type === "deposit") {
      const path = DB.userDeposit(userId, id);
      const snap = await get(ref(database, path));
      const record = snap.val() as DepositRecord | null;
      if (!record) return { success: false, error: "Transaction not found" };
      return { success: true, data: { kind: "deposit", id, record } };
    }

    if (type === "withdrawal") {
      const path = DB.userWithdrawal(userId, id);
      const snap = await get(ref(database, path));
      const record = snap.val() as WithdrawalRecord | null;
      if (!record) return { success: false, error: "Transaction not found" };
      return { success: true, data: { kind: "withdrawal", id, record } };
    }

    return { success: false, error: "Invalid transaction type" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load transaction";
    return { success: false, error: message };
  }
}
