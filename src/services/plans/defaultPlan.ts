"use client";

import type { UserPlan } from "./types";

/** Default plan for users who have no investment plan yet — lets them start and earn. */
export const DEFAULT_PLAN_NAME = "Starter";
export const DEFAULT_PLAN_MIN_AMOUNT = 50;

/** Placeholder UserPlan for "no plans yet" — not stored in DB; used so UI can show Start investment. */
export function getDefaultPlanPlaceholder(): UserPlan {
  const now = Date.now();
  const date = new Date(now);
  const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  return {
    id: "default",
    planName: DEFAULT_PLAN_NAME,
    amount: String(DEFAULT_PLAN_MIN_AMOUNT),
    amountNum: DEFAULT_PLAN_MIN_AMOUNT,
    date: dateStr,
    dateSortKey: now,
    name: 0,
    isDefault: true,
    totalProfit: 0,
    record: {
      amount: String(DEFAULT_PLAN_MIN_AMOUNT),
      date: dateStr,
      name: 0,
      plan: DEFAULT_PLAN_NAME,
    },
  };
}
