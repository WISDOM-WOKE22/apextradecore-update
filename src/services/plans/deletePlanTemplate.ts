"use client";

import { ref, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type DeletePlanTemplateResult =
  | { success: true }
  | { success: false; error: string };

export async function deletePlanTemplate(templateId: string): Promise<DeletePlanTemplateResult> {
  if (!templateId) return { success: false, error: "Template ID is required" };
  try {
    const templateRef = ref(database, DB.planTemplate(templateId));
    await remove(templateRef);
    return { success: true };
  } catch (err) {
    console.error("[deletePlanTemplate]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete plan template",
    };
  }
}
