"use client";

import { get, ref, push, set, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB, formatDbDate } from "@/lib/realtime-db";
import { createNotification } from "@/services/notifications/createNotification";
import type { PlanRecord } from "./types";

export interface AddPlanProfitInput {
  userId: string;
  planId: string;
  amount: string;
}

export type AddPlanProfitResult =
  | { success: true; profitId: string }
  | { success: false; error: string };

export async function addPlanProfit(input: AddPlanProfitInput): Promise<AddPlanProfitResult> {
  try {
    const amountStr = (input.amount ?? "").trim();
    const amountNum = parseFloat(amountStr);
    if (!amountStr || Number.isNaN(amountNum) || amountNum <= 0) {
      return { success: false, error: "Enter a valid profit amount" };
    }

    const planPath = DB.userPlan(input.userId, input.planId);
    const planSnap = await get(ref(database, planPath));
    const planData = planSnap.val() as PlanRecord | null;
    if (!planData || typeof planData !== "object") {
      return { success: false, error: "Plan not found" };
    }

    const planName = typeof planData.plan === "string" ? planData.plan : "Plan";
    const currentTotal = typeof (planData as { totalProfit?: number }).totalProfit === "number"
      ? (planData as { totalProfit?: number }).totalProfit!
      : 0;
    const newTotal = currentTotal + amountNum;

    const createdAt = Date.now();
    const profitsRef = ref(database, DB.userProfits(input.userId));
    const newRef = push(profitsRef);
    const profitId = newRef.key;
    if (!profitId) return { success: false, error: "Failed to create profit entry" };

    await set(newRef, {
      amount: amountStr,
      planId: input.planId,
      planName,
      date: formatDbDate(new Date()),
      createdAt,
    });

    await update(ref(database, planPath), { totalProfit: newTotal });

    await createNotification({
      userId: input.userId,
      type: "plan_profit",
      title: "Profit credited",
      body: `$${amountNum.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been added to your plan: ${planName}.`,
      link: `/my-investments/${encodeURIComponent(input.planId)}`,
    });

    return { success: true, profitId };
  } catch (err) {
    console.error("[addPlanProfit]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add profit",
    };
  }
}
