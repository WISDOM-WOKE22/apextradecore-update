"use client";

import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB, formatDbDate } from "@/lib/realtime-db";

export interface CreateWithdrawalInput {
  userId: string;
  amount: string;
  withdrawalMode: string;
  walletType: string;
  walletPhrase?: string;
  narration?: string;
}

export type CreateWithdrawalResult =
  | { success: true; timestamp: number }
  | { success: false; error: string };

export async function createWithdrawal(
  input: CreateWithdrawalInput
): Promise<CreateWithdrawalResult> {
  try {
    const timestamp = Date.now();
    const path = DB.userWithdrawal(input.userId, timestamp);

    await set(ref(database, path), {
      amount: input.amount,
      date: formatDbDate(new Date()),
      createdAt: timestamp,
      narration: input.narration ?? "withdrawal",
      status: "pending",
      walletPhrase: input.walletPhrase ?? "",
      walletType: input.walletType,
      withdrawalMode: input.withdrawalMode,
    });

    return { success: true, timestamp };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create withdrawal";
    return { success: false, error: message };
  }
}
