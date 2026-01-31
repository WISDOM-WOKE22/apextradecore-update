"use client";

import { get, ref, push, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { PlanTemplateRecord } from "./types";

export interface CreatePlanTemplateInput {
  name: string;
  minAmount: number;
  /** Expected return in dollars (e.g. 2000) */
  expectedReturn: number;
  /** Number of days until expected return is received */
  returnDays: number;
}

export type CreatePlanTemplateResult =
  | { success: true; templateId: string }
  | { success: false; error: string };

export async function createPlanTemplate(
  input: CreatePlanTemplateInput
): Promise<CreatePlanTemplateResult> {
  try {
    const name = (input.name ?? "").trim();
    const minAmount = Number(input.minAmount);
    const expectedReturn = Number(input.expectedReturn);
    const returnDays = Number(input.returnDays);
    if (!name) return { success: false, error: "Plan name is required" };
    if (!Number.isFinite(minAmount) || minAmount < 0) {
      return { success: false, error: "Enter a valid minimum amount" };
    }
    if (!Number.isFinite(expectedReturn) || expectedReturn < 0) {
      return { success: false, error: "Enter a valid expected return amount ($)" };
    }
    if (!Number.isInteger(returnDays) || returnDays < 0) {
      return { success: false, error: "Enter a valid number of days (0 or more)" };
    }

    const templatesRef = ref(database, DB.planTemplates);
    const snap = await get(templatesRef);
    const val = snap.val() as Record<string, unknown> | null;
    const count = val && typeof val === "object" ? Object.keys(val).length : 0;
    const order = count;

    const newRef = push(templatesRef);
    const templateId = newRef.key;
    if (!templateId) return { success: false, error: "Failed to create plan template" };

    const payload: PlanTemplateRecord = {
      name,
      minAmount,
      expectedReturn,
      returnDays,
      disabled: false,
      order,
      createdAt: Date.now(),
    };

    await set(newRef, payload);
    return { success: true, templateId };
  } catch (err) {
    console.error("[createPlanTemplate]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create plan template",
    };
  }
}
