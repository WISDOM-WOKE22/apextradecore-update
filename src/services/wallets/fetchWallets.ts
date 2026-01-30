"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { Wallet, WalletRecord } from "./types";

export interface FetchWalletsResult {
  wallets: Wallet[];
  error?: string;
}

export async function fetchWallets(): Promise<FetchWalletsResult> {
  try {
    const snap = await get(ref(database, DB.wallets));
    const val = snap.val() as Record<string, WalletRecord> | null;
    if (!val || typeof val !== "object") {
      return { wallets: [] };
    }
    const wallets: Wallet[] = [];
    for (const [id, w] of Object.entries(val)) {
      if (!w || typeof w !== "object") continue;
      wallets.push({
        id,
        name: typeof w.name === "string" ? w.name : "",
        address: typeof w.address === "string" ? w.address : "",
        enabled: w.enabled === true,
        order: typeof w.order === "number" ? w.order : 0,
        createdAt: typeof w.createdAt === "number" ? w.createdAt : 0,
      });
    }
    wallets.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.createdAt - b.createdAt;
    });
    return { wallets };
  } catch (err) {
    console.error("[fetchWallets]", err);
    return {
      wallets: [],
      error: err instanceof Error ? err.message : "Failed to load wallets",
    };
  }
}
