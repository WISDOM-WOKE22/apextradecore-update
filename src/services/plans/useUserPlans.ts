"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchUserPlans } from "./fetchUserPlans";
import { getDefaultPlanPlaceholder } from "./defaultPlan";
import type { UserPlan } from "./types";

export interface UseUserPlansResult {
  plans: UserPlan[];
  defaultPlan: UserPlan;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserPlans(userId: string | null): UseUserPlansResult {
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  const defaultPlan = getDefaultPlanPlaceholder();

  const refetch = useCallback(async () => {
    if (!userId) {
      setPlans([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { plans: next } = await fetchUserPlans(userId);
      setPlans(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { plans, defaultPlan, loading, error, refetch };
}
