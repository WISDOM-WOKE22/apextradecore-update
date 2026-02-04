"use client";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type UpdateWithdrawalFeeDisabledResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Set whether withdrawal fee is disabled for a specific user.
 * When true, that user will not see or be charged the withdrawal fee.
 */
export async function updateUserWithdrawalFeeDisabled(
  uid: string,
  disabled: boolean
): Promise<UpdateWithdrawalFeeDisabledResult> {
  if (!uid.trim()) {
    return { success: false, error: "Invalid user." };
  }
  try {
    const userRef = ref(database, DB.user(uid));
    await update(userRef, { withdrawalFeeDisabled: disabled });
    return { success: true };
  } catch (err) {
    console.error("[updateUserWithdrawalFeeDisabled]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update setting",
    };
  }
}
