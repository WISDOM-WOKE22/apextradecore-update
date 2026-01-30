"use client";

import { ref, push, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB, formatDbDate } from "@/lib/realtime-db";

export interface CreatePlanInput {
  userId: string;
  planName: string;
  amount: string;
  /** Optional: next plan index (name) for this user; if not provided we use next key. */
  name?: number;
}

export type CreatePlanResult =
  | { success: true; planId: string }
  | { success: false; error: string };

export async function createPlan(input: CreatePlanInput): Promise<CreatePlanResult> {
  try {
    const userPlansRef = ref(database, DB.userPlans(input.userId));
    const newRef = push(userPlansRef);
    const planId = newRef.key;
    if (!planId) return { success: false, error: "Failed to create plan" };

    const createdAt = Date.now();
    const payload = {
      amount: input.amount,
      date: formatDbDate(new Date()),
      createdAt,
      name: typeof input.name === "number" ? input.name : 1,
      plan: input.planName,
    };

    await set(newRef, payload);
    return { success: true, planId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create plan";
    return { success: false, error: message };
  }
}
