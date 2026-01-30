"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllTransactions } from "./fetchAllTransactions";
import type { AdminTransactionRow } from "./types";

export interface UseAllTransactionsResult {
  transactions: AdminTransactionRow[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllTransactions(): UseAllTransactionsResult {
  const [transactions, setTransactions] = useState<AdminTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAllTransactions();
    setTransactions(result.transactions);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { transactions, loading, error, refetch };
}
