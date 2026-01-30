"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPlanTransactions } from "./fetchPlanTransactions";
import type { UserPlan } from "./types";
import type { PlanTransaction } from "./fetchPlanTransactions";

export interface UsePlanTransactionsResult {
  transactions: PlanTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePlanTransactions(
  userId: string | null,
  plan: UserPlan | null
): UsePlanTransactionsResult {
  const [transactions, setTransactions] = useState<PlanTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId || !plan) {
      setTransactions([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetchPlanTransactions(userId, plan.id, plan);
    setTransactions(result.transactions);
    if (result.error) setError(result.error);
    setLoading(false);
  }, [userId, plan?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { transactions, loading, error, refetch };
}
