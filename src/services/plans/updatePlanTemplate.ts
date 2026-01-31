"use client";

import { ref, update as rtdbUpdate } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export interface UpdatePlanTemplateInput {
  name?: string;
  minAmount?: number;
  expectedReturn?: number;
  returnDays?: number;
  disabled?: boolean;
  order?: number;
}

export type UpdatePlanTemplateResult =
  | { success: true }
  | { success: false; error: string };

export async function updatePlanTemplate(
  templateId: string,
  input: UpdatePlanTemplateInput
): Promise<UpdatePlanTemplateResult> {
  if (!templateId) return { success: false, error: "Template ID is required" };
  try {
    const updates: Record<string, unknown> = {};
    if (typeof input.name === "string") updates.name = input.name.trim();
    if (typeof input.minAmount === "number" && Number.isFinite(input.minAmount)) {
      updates.minAmount = input.minAmount;
    }
    if (typeof input.expectedReturn === "number" && Number.isFinite(input.expectedReturn) && input.expectedReturn >= 0) {
      updates.expectedReturn = input.expectedReturn;
    }
    if (typeof input.returnDays === "number" && Number.isInteger(input.returnDays) && input.returnDays >= 0) {
      updates.returnDays = input.returnDays;
    }
    if (typeof input.disabled === "boolean") updates.disabled = input.disabled;
    if (typeof input.order === "number") updates.order = input.order;
    if (Object.keys(updates).length === 0) return { success: true };

    const templateRef = ref(database, DB.planTemplate(templateId));
    await rtdbUpdate(templateRef, updates);
    return { success: true };
  } catch (err) {
    console.error("[updatePlanTemplate]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update plan template",
    };
  }
}
