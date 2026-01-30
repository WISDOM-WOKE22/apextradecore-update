"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAdminDashboardStats } from "./fetchAdminDashboardStats";
import type { AdminDashboardStats } from "./types";

export interface UseAdminDashboardResult {
  data: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminDashboard(): UseAdminDashboardResult {
  const [data, setData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminDashboardStats();
    setLoading(false);
    if (result.success) setData(result.data);
    else setError(result.error);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
