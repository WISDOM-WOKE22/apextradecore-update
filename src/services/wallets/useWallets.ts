"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWallets } from "./fetchWallets";
import { createWallet } from "./createWallet";
import { updateWallet } from "./updateWallet";
import { deleteWallet } from "./deleteWallet";
import type { Wallet } from "./types";

export interface UseWalletsResult {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addWallet: (name: string, address: string) => Promise<{ success: boolean; error?: string }>;
  updateWalletEnabled: (id: string, enabled: boolean) => Promise<{ success: boolean; error?: string }>;
  updateWalletName: (id: string, name: string) => Promise<{ success: boolean; error?: string }>;
  updateWalletAddress: (id: string, address: string) => Promise<{ success: boolean; error?: string }>;
  removeWallet: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useWallets(): UseWalletsResult {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchWallets();
    setWallets(result.wallets);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addWallet = useCallback(
    async (name: string, address: string) => {
      const result = await createWallet({ name: name.trim(), address: address.trim() });
      if (result.success) await refetch();
      return result.success ? { success: true } : { success: false, error: result.error };
    },
    [refetch]
  );

  const updateWalletEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      const result = await updateWallet(id, { enabled });
      if (result.success) await refetch();
      return result.success ? { success: true } : { success: false, error: result.error };
    },
    [refetch]
  );

  const updateWalletName = useCallback(
    async (id: string, name: string) => {
      const result = await updateWallet(id, { name: name.trim() });
      if (result.success) await refetch();
      return result.success ? { success: true } : { success: false, error: result.error };
    },
    [refetch]
  );

  const updateWalletAddress = useCallback(
    async (id: string, address: string) => {
      const result = await updateWallet(id, { address: address.trim() });
      if (result.success) await refetch();
      return result.success ? { success: true } : { success: false, error: result.error };
    },
    [refetch]
  );

  const removeWallet = useCallback(
    async (id: string) => {
      const result = await deleteWallet(id);
      if (result.success) await refetch();
      return result.success ? { success: true } : { success: false, error: result.error };
    },
    [refetch]
  );

  return {
    wallets,
    loading,
    error,
    refetch,
    addWallet,
    updateWalletEnabled,
    updateWalletName,
    updateWalletAddress,
    removeWallet,
  };
}
