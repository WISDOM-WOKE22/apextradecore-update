"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { PlanRecord, UserPlan } from "./types";

function parseDbDateToMs(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return 0;
  const [d, m, y] = parts;
  if (!y || !m) return 0;
  return new Date(y, m - 1, d).getTime();
}

export type FetchPlanDetailResult =
  | { success: true; plan: UserPlan }
  | { success: false; error: string };

export async function fetchPlanDetail(
  userId: string,
  planId: string
): Promise<FetchPlanDetailResult> {
  try {
    const path = DB.userPlan(userId, planId);
    const snap = await get(ref(database, path));
    const data = snap.val() as PlanRecord | null;
    if (!data) return { success: false, error: "Plan not found" };

    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof data.createdAt === "number" && data.createdAt > 0
        ? data.createdAt
        : parseDbDateToMs(dateStr);

    const totalProfit = typeof (data as { totalProfit?: number }).totalProfit === "number"
      ? (data as { totalProfit?: number }).totalProfit!
      : 0;
    const plan: UserPlan = {
      id: planId,
      planName: data.plan ?? "Starter",
      amount,
      amountNum: parseFloat(amount) || 0,
      date: dateStr,
      dateSortKey,
      name: typeof data.name === "number" ? data.name : 0,
      isDefault: false,
      totalProfit,
      record: data,
    };
    return { success: true, plan };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load plan";
    return { success: false, error: message };
  }
}
