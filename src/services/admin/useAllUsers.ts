"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllUsers } from "./fetchAllUsers";
import type { AdminUserSummary } from "./types";

export interface UseAllUsersResult {
  users: AdminUserSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllUsers(): UseAllUsersResult {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAllUsers();
    setUsers(result.users);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, loading, error, refetch };
}
