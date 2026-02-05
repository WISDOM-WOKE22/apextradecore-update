"use client";

import { get, ref, update, push, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB, formatDbDate } from "@/lib/realtime-db";
import { createNotification } from "@/services/notifications/createNotification";
import type { PlanRecord } from "./types";

export type ReturnInvestmentResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Return an investment: mark plan as returned, record the return for history,
 * and credit the user's balance (by excluding this plan from totalInvested).
 * The amount is tagged as "Investment return" and appears in balance immediately.
 */
export async function returnInvestment(
  uid: string,
  planKey: string
): Promise<ReturnInvestmentResult> {
  if (!uid.trim() || !planKey.trim()) {
    return { success: false, error: "Invalid user or plan." };
  }

  try {
    const planPath = DB.userPlan(uid, planKey);
    const planSnap = await get(ref(database, planPath));
    const planData = planSnap.val() as PlanRecord | null;

    if (!planData || typeof planData !== "object") {
      return { success: false, error: "Investment not found." };
    }

    if ((planData as { status?: string }).status === "returned") {
      return { success: false, error: "This investment has already been returned." };
    }

    const amount = parseFloat(String(planData.amount ?? 0)) || 0;
    if (amount <= 0) {
      return { success: false, error: "Invalid investment amount." };
    }

    const planName = typeof planData.plan === "string" ? planData.plan : "Plan";
    const returnedAt = Date.now();

    await update(ref(database, planPath), {
      status: "returned",
      returnedAt,
    });

    const returnsRef = ref(database, DB.userInvestmentReturns(uid));
    const newRef = push(returnsRef);
    const returnId = newRef.key;
    if (!returnId) {
      return { success: false, error: "Failed to create return record." };
    }

    await set(newRef, {
      amount: String(amount),
      planKey,
      planName,
      date: formatDbDate(new Date()),
      createdAt: returnedAt,
      type: "investment_return",
    });

    await createNotification({
      userId: uid,
      type: "plan_profit",
      title: "Investment return",
      body: `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} from ${planName} has been returned to your account. Check your transactions for the "Investment return" entry.`,
      link: "/dashboard/transactions",
    });

    return { success: true };
  } catch (err) {
    console.error("[returnInvestment]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to return investment",
    };
  }
}
