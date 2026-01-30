"use client";

import { ref, remove } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type DeletePlanResult =
  | { success: true }
  | { success: false; error: string };

export async function deletePlan(userId: string, planId: string): Promise<DeletePlanResult> {
  try {
    const path = DB.userPlan(userId, planId);
    await remove(ref(database, path));
    return { success: true };
  } catch (err) {
    console.error("[deletePlan]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete plan",
    };
  }
}
