"use client";

import { get, ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import { createNotification } from "@/services/notifications/createNotification";
import type { DepositRecord } from "@/services/transactions/types";
import type { WithdrawalRecord } from "@/services/transactions/types";

export type TransactionStatusAction = "approve" | "reject";

export interface UpdateTransactionStatusResult {
  success: boolean;
  error?: string;
}

export async function updateDepositStatus(
  userId: string,
  depositId: string,
  action: TransactionStatusAction
): Promise<UpdateTransactionStatusResult> {
  try {
    const path = DB.userDeposit(userId, depositId);
    const depositSnap = await get(ref(database, path));
    const deposit = depositSnap.val() as DepositRecord | null;
    const amount = deposit && typeof deposit.amount === "string" ? deposit.amount : "—";

    const status = action === "approve" ? "approved" : "rejected";
    await update(ref(database, path), { status });

    const type = action === "approve" ? "deposit_approved" : "deposit_rejected";
    const title = action === "approve" ? "Deposit approved" : "Deposit rejected";
    const body =
      action === "approve"
        ? `Your deposit of $${amount} has been approved and credited to your account.`
        : `Your deposit of $${amount} was not approved. Contact support if you have questions.`;
    await createNotification({
      userId,
      type,
      title,
      body,
      link: `/dashboard/transactions/deposit/${encodeURIComponent(depositId)}`,
    });

    return { success: true };
  } catch (err) {
    console.error("[updateDepositStatus]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update deposit status",
    };
  }
}

export async function updateWithdrawalStatus(
  userId: string,
  withdrawalId: string,
  action: TransactionStatusAction
): Promise<UpdateTransactionStatusResult> {
  try {
    const path = DB.userWithdrawal(userId, withdrawalId);
    const withdrawalSnap = await get(ref(database, path));
    const withdrawal = withdrawalSnap.val() as WithdrawalRecord | null;
    const amount = withdrawal && typeof withdrawal.amount === "string" ? withdrawal.amount : "—";

    const status = action === "approve" ? "approved" : "rejected";
    await update(ref(database, path), { status });

    const type = action === "approve" ? "withdrawal_approved" : "withdrawal_rejected";
    const title = action === "approve" ? "Withdrawal approved" : "Withdrawal rejected";
    const body =
      action === "approve"
        ? `Your withdrawal of $${amount} has been approved.`
        : `Your withdrawal of $${amount} was not approved. Contact support if you have questions.`;
    await createNotification({
      userId,
      type,
      title,
      body,
      link: `/dashboard/transactions/withdrawal/${encodeURIComponent(withdrawalId)}`,
    });

    return { success: true };
  } catch (err) {
    console.error("[updateWithdrawalStatus]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update withdrawal status",
    };
  }
}
