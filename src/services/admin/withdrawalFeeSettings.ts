"use client";

import { get, ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type GetWithdrawalFeeResult =
  | { success: true; percent: number }
  | { success: false; error: string };

export async function getWithdrawalFeePercent(): Promise<GetWithdrawalFeeResult> {
  try {
    const snap = await get(ref(database, DB.withdrawalFeePercent));
    const val = snap.val();
    if (val == null || val === "") {
      return { success: true, percent: 0 };
    }
    const num = typeof val === "number" ? val : parseFloat(String(val));
    const percent = Number.isFinite(num) && num >= 0 ? Math.min(100, num) : 0;
    return { success: true, percent };
  } catch (err) {
    console.error("[getWithdrawalFeePercent]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load withdrawal fee",
    };
  }
}

export type SetWithdrawalFeeResult =
  | { success: true }
  | { success: false; error: string };

export async function setWithdrawalFeePercent(percent: number): Promise<SetWithdrawalFeeResult> {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    return { success: false, error: "Enter a percentage between 0 and 100." };
  }
  try {
    const rounded = Math.round(percent * 100) / 100;
    await set(ref(database, DB.withdrawalFeePercent), rounded);
    return { success: true };
  } catch (err) {
    console.error("[setWithdrawalFeePercent]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save withdrawal fee",
    };
  }
}
