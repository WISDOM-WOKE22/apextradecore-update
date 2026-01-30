"use client";

import { ref, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type DeleteWalletResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteWallet(walletId: string): Promise<DeleteWalletResult> {
  try {
    const path = DB.wallet(walletId);
    await remove(ref(database, path));
    return { success: true };
  } catch (err) {
    console.error("[deleteWallet]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete wallet",
    };
  }
}
