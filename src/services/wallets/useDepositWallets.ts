"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchDepositWallets } from "./fetchDepositWallets";
import type { Wallet } from "./types";

export interface UseDepositWalletsResult {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDepositWallets(): UseDepositWalletsResult {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchDepositWallets();
    setWallets(result.wallets);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { wallets, loading, error, refetch };
}
