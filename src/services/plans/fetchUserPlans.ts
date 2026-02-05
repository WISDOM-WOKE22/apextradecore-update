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
  const date = new Date(y, m - 1, d);
  return date.getTime();
}

function parsePlans(snapshot: { val: () => Record<string, PlanRecord> | null }): UserPlan[] {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return [];
  return Object.entries(val).map(([planKey, data]) => {
    const amount = typeof data.amount === "string" ? data.amount : String(data.amount ?? "0");
    const amountNum = parseFloat(amount) || 0;
    const dateStr = data.date ?? "";
    const dateSortKey =
      typeof data.createdAt === "number" && data.createdAt > 0
        ? data.createdAt
        : parseDbDateToMs(dateStr);
    const totalProfit = typeof (data as { totalProfit?: number }).totalProfit === "number"
      ? (data as { totalProfit?: number }).totalProfit!
      : 0;
    const returned = data.status === "returned";
    return {
      id: planKey,
      planName: data.plan ?? "Starter",
      amount,
      amountNum,
      date: dateStr,
      dateSortKey,
      name: typeof data.name === "number" ? data.name : 0,
      isDefault: false,
      totalProfit,
      returned: returned || undefined,
      record: data,
    };
  });
}

export interface FetchUserPlansResult {
  plans: UserPlan[];
}

export async function fetchUserPlans(userId: string): Promise<FetchUserPlansResult> {
  const snap = await get(ref(database, DB.userPlans(userId)));
  const plans = parsePlans(snap);
  plans.sort((a, b) => b.dateSortKey - a.dateSortKey);
  return { plans };
}
