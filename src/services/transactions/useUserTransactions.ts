"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchUserTransactions, type FetchUserTransactionsResult } from "./fetchUserTransactions";
import type { UnifiedTransaction } from "./types";

export type TransactionFilter = "all" | "deposit" | "withdrawal" | "investment" | "profit";

export interface UseUserTransactionsResult {
  data: FetchUserTransactionsResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filtered: UnifiedTransaction[];
  filter: TransactionFilter;
  setFilter: (f: TransactionFilter) => void;
}

export function useUserTransactions(): UseUserTransactionsResult {
  const [data, setData] = useState<FetchUserTransactionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>("all");

  const load = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserTransactions(user.uid);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) load();
      else {
        setData(null);
        setLoading(false);
        setError(null);
      }
    });
    return () => unsubscribe();
  }, [load]);

  const filtered =
    !data?.all
      ? []
      : filter === "all"
        ? data.all
        : filter === "deposit"
          ? data.deposits
          : filter === "withdrawal"
            ? data.withdrawals
            : filter === "profit"
              ? data.profits ?? []
              : data.investments ?? [];

  return { data, loading, error, refetch: load, filtered, filter, setFilter };
}
