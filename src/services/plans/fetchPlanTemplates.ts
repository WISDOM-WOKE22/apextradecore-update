"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { PlanTemplate, PlanTemplateRecord } from "./types";

export interface FetchPlanTemplatesResult {
  templates: PlanTemplate[];
  error?: string;
}

export async function fetchPlanTemplates(): Promise<FetchPlanTemplatesResult> {
  try {
    const snap = await get(ref(database, DB.planTemplates));
    const val = snap.val() as Record<string, PlanTemplateRecord> | null;
    if (!val || typeof val !== "object") {
      return { templates: [] };
    }
    const templates: PlanTemplate[] = [];
    for (const [id, data] of Object.entries(val)) {
      if (!data || typeof data !== "object") continue;
      const minAmount = typeof data.minAmount === "number" ? data.minAmount : parseFloat(String(data.minAmount ?? 0)) || 0;
      const expectedReturn = typeof data.expectedReturn === "number" ? data.expectedReturn : parseFloat(String(data.expectedReturn ?? 0)) || 0;
      const returnDays = typeof data.returnDays === "number" ? data.returnDays : parseInt(String(data.returnDays ?? 0), 10) || 0;
      templates.push({
        id,
        name: typeof data.name === "string" ? data.name : String(data.name ?? ""),
        minAmount,
        expectedReturn,
        returnDays: returnDays >= 0 ? returnDays : 0,
        disabled: Boolean(data.disabled),
        order: typeof data.order === "number" ? data.order : 0,
        createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
      });
    }
    templates.sort((a, b) => a.order - b.order || (a.name || "").localeCompare(b.name || ""));
    return { templates };
  } catch (err) {
    console.error("[fetchPlanTemplates]", err);
    return {
      templates: [],
      error: err instanceof Error ? err.message : "Failed to load plan templates",
    };
  }
}
