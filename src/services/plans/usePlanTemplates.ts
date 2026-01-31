"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPlanTemplates } from "./fetchPlanTemplates";
import type { PlanTemplate } from "./types";

export interface UsePlanTemplatesResult {
  templates: PlanTemplate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePlanTemplates(): UsePlanTemplatesResult {
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchPlanTemplates();
    setTemplates(result.templates);
    if (result.error) setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { templates, loading, error, refetch };
}
