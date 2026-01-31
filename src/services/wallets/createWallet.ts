"use client";

import { get, ref, push, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export interface CreateWalletInput {
  name: string;
  address: string;
  /** Network or chain (e.g. "Ethereum (ERC-20)") so users know which network to deposit on */
  networkChain?: string;
}

export type CreateWalletResult =
  | { success: true; walletId: string }
  | { success: false; error: string };

export async function createWallet(input: CreateWalletInput): Promise<CreateWalletResult> {
  try {
    const name = (input.name ?? "").trim();
    const address = (input.address ?? "").trim();
    const networkChain = (input.networkChain ?? "").trim();
    if (!name) return { success: false, error: "Wallet name is required" };
    if (!address) return { success: false, error: "Wallet address is required" };

    const walletsRef = ref(database, DB.wallets);
    const snap = await get(walletsRef);
    const val = snap.val() as Record<string, { order?: number }> | null;
    const maxOrder = val && typeof val === "object"
      ? Math.max(0, ...Object.values(val).map((w) => (w && typeof w.order === "number" ? w.order : 0)))
      : 0;

    const newRef = push(walletsRef);
    const walletId = newRef.key;
    if (!walletId) return { success: false, error: "Failed to create wallet" };

    const createdAt = Date.now();
    await set(newRef, {
      name,
      address,
      ...(networkChain ? { networkChain } : {}),
      enabled: true,
      order: maxOrder + 1,
      createdAt,
    });

    return { success: true, walletId };
  } catch (err) {
    console.error("[createWallet]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create wallet",
    };
  }
}
