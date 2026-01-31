"use client";

import { ref, update, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export interface UpdateWalletInput {
  name?: string;
  address?: string;
  networkChain?: string;
  enabled?: boolean;
  order?: number;
}

export type UpdateWalletResult =
  | { success: true }
  | { success: false; error: string };

export async function updateWallet(
  walletId: string,
  input: UpdateWalletInput
): Promise<UpdateWalletResult> {
  try {
    const path = DB.wallet(walletId);
    const updates: Record<string, string | number | boolean> = {};
    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.address !== undefined) updates.address = input.address.trim();
    if (input.networkChain !== undefined) updates.networkChain = input.networkChain.trim();
    if (input.enabled !== undefined) updates.enabled = input.enabled;
    if (input.order !== undefined) updates.order = input.order;
    if (Object.keys(updates).length === 0) return { success: true };

    const existing = await get(ref(database, path));
    if (!existing.exists()) return { success: false, error: "Wallet not found" };

    await update(ref(database, path), updates);
    return { success: true };
  } catch (err) {
    console.error("[updateWallet]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update wallet",
    };
  }
}
