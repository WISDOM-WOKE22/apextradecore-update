"use client";

import { fetchWallets } from "./fetchWallets";
import type { Wallet } from "./types";

export interface FetchDepositWalletsResult {
  wallets: Wallet[];
  error?: string;
}

/** Returns only enabled wallets for the user deposit flow. */
export async function fetchDepositWallets(): Promise<FetchDepositWalletsResult> {
  const result = await fetchWallets();
  const wallets = result.wallets.filter((w) => w.enabled);
  return { wallets, error: result.error };
}
