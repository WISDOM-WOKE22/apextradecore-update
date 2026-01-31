"use client";

import { get, ref, update as rtdbUpdate } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export interface UpdateBalanceResult {
  success: boolean;
  error?: string;
}

/**
 * Add or subtract an amount from the user's balance adjustment.
 * Displayed balance = (deposits - withdrawals - invested) + balanceAdjustment.
 */
export async function updateUserBalanceAdjustment(
  uid: string,
  delta: number
): Promise<UpdateBalanceResult> {
  if (!uid) {
    return { success: false, error: "User ID is required" };
  }
  try {
    const userRef = ref(database, DB.user(uid));
    const snap = await get(userRef);
    const val = snap.val() as { balanceAdjustment?: number } | null;
    const current =
      typeof val?.balanceAdjustment === "number"
        ? val.balanceAdjustment
        : (typeof val?.balanceAdjustment === "string"
            ? parseFloat(val.balanceAdjustment)
            : NaN) || 0;
    const next = current + delta;
    await rtdbUpdate(userRef, { balanceAdjustment: next });
    return { success: true };
  } catch (err) {
    console.error("[updateUserBalanceAdjustment]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update balance",
    };
  }
}
