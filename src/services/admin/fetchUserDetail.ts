"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { AdminUserDetail, AdminUserSummary, UserRecord } from "./types";
import type { DepositRecord, WithdrawalRecord } from "@/services/transactions/types";
import type { PlanRecord } from "@/services/plans/types";

function isApproved(s: string): boolean {
  const lower = (s ?? "").toLowerCase();
  return lower === "approved" || lower === "completed";
}

function parseDbDateToMs(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return 0;
  const [d, m, y] = parts;
  if (!y || !m) return 0;
  return new Date(y, m - 1, d).getTime();
}

function formatDateStr(dateStr: string, dateSortKey: number): string {
  if (dateSortKey > 0) {
    return new Date(dateSortKey).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return dateStr || "—";
}

export type FetchUserDetailResult =
  | { success: true; data: AdminUserDetail }
  | { success: false; error: string };

export async function fetchUserDetail(uid: string): Promise<FetchUserDetailResult> {
  try {
    const [userSnap, depositsSnap, withdrawalsSnap, plansSnap, profitsSnap] = await Promise.all([
      get(ref(database, DB.user(uid))),
      get(ref(database, DB.userDeposits(uid))),
      get(ref(database, DB.userWithdrawals(uid))),
      get(ref(database, DB.userPlans(uid))),
      get(ref(database, DB.userProfits(uid))),
    ]);

    const userVal = userSnap.val() as UserRecord | null;
    if (!userVal) {
      return { success: false, error: "User not found" };
    }

    const role = (userVal.role ?? "user").toLowerCase();
    const withdrawalFeeDisabled = userVal.withdrawalFeeDisabled === true;
    const suspended = userVal.suspended === true;
    const profile: AdminUserSummary = {
      uid,
      fullName: typeof userVal.username === "string" ? userVal.username : "",
      email: typeof userVal.email === "string" ? userVal.email : "",
      country: typeof userVal.country === "string" ? userVal.country : "",
      phoneNumber: typeof userVal.phoneNumber === "string" ? userVal.phoneNumber : "",
      date: typeof userVal.date === "string" ? userVal.date : "",
      role,
      password: typeof userVal.password === "string" ? userVal.password : "",
      withdrawalFeeDisabled,
      suspended,
    };

    const depositsVal = depositsSnap.val() as Record<string, DepositRecord> | null;
    const withdrawalsVal = withdrawalsSnap.val() as Record<string, WithdrawalRecord> | null;
    const plansVal = plansSnap.val() as Record<string, PlanRecord> | null;

    const deposits: AdminUserDetail["deposits"] = [];
    let totalDepositsApproved = 0;
    if (depositsVal && typeof depositsVal === "object") {
      for (const [id, d] of Object.entries(depositsVal)) {
        const amount = parseFloat(String(d?.amount ?? 0)) || 0;
        const dateStr = d?.date ?? "";
        const dateSortKey =
          typeof (d as { createdAt?: number }).createdAt === "number"
            ? (d as { createdAt?: number }).createdAt!
            : parseDbDateToMs(dateStr);
        const status = (d?.status ?? "pending").toLowerCase();
        if (isApproved(d?.status ?? "")) totalDepositsApproved += amount;
        deposits.push({
          id,
          amount,
          amountStr: amount.toFixed(2),
          date: formatDateStr(dateStr, dateSortKey),
          dateSortKey,
          status: status === "approved" || status === "completed" ? "completed" : status,
          paymentMethod: d?.paymentMethod ?? "—",
        });
      }
    }
    deposits.sort((a, b) => b.dateSortKey - a.dateSortKey);

    const withdrawals: AdminUserDetail["withdrawals"] = [];
    let totalWithdrawalsApproved = 0;
    if (withdrawalsVal && typeof withdrawalsVal === "object") {
      for (const [id, w] of Object.entries(withdrawalsVal)) {
        const amount = parseFloat(String(w?.amount ?? 0)) || 0;
        const dateStr = w?.date ?? "";
        const dateSortKey =
          typeof (w as { createdAt?: number }).createdAt === "number"
            ? (w as { createdAt?: number }).createdAt!
            : parseDbDateToMs(dateStr) || parseInt(id, 10) || 0;
        const status = (w?.status ?? "pending").toLowerCase();
        if (isApproved(w?.status ?? "")) totalWithdrawalsApproved += amount;
        withdrawals.push({
          id,
          amount,
          amountStr: amount.toFixed(2),
          date: formatDateStr(dateStr, dateSortKey),
          dateSortKey,
          status: status === "approved" || status === "completed" ? "completed" : status,
          withdrawalMode: w?.withdrawalMode ?? w?.walletType ?? "—",
        });
      }
    }
    withdrawals.sort((a, b) => b.dateSortKey - a.dateSortKey);

    const investments: AdminUserDetail["investments"] = [];
    let totalInvested = 0;
    if (plansVal && typeof plansVal === "object") {
      for (const [id, p] of Object.entries(plansVal)) {
        const amount = parseFloat(String(p?.amount ?? 0)) || 0;
        totalInvested += amount;
        const dateStr = p?.date ?? "";
        const dateSortKey =
          typeof (p as { createdAt?: number }).createdAt === "number"
            ? (p as { createdAt?: number }).createdAt!
            : parseDbDateToMs(dateStr);
        investments.push({
          id,
          amount,
          amountStr: amount.toFixed(2),
          date: formatDateStr(dateStr, dateSortKey),
          dateSortKey,
          planName: p?.plan ?? "Starter",
        });
      }
    }
    investments.sort((a, b) => b.dateSortKey - a.dateSortKey);

    let totalProfits = 0;
    const profitsVal = profitsSnap.val() as Record<string, { amount?: string | number }> | null;
    if (profitsVal && typeof profitsVal === "object") {
      for (const data of Object.values(profitsVal)) {
        const amt = data?.amount;
        totalProfits += typeof amt === "number" ? amt : (parseFloat(String(amt ?? 0)) || 0);
      }
    }

    const computedBalance = totalDepositsApproved - totalWithdrawalsApproved - totalInvested + totalProfits;
    const adjustment =
      typeof userVal.balanceAdjustment === "number"
        ? userVal.balanceAdjustment
        : parseFloat(String(userVal.balanceAdjustment ?? 0)) || 0;
    const accountBalance = computedBalance + adjustment;

    const data: AdminUserDetail = {
      profile,
      totalDeposits: totalDepositsApproved,
      totalWithdrawals: totalWithdrawalsApproved,
      totalInvested,
      totalProfits,
      accountBalance,
      depositsCount: deposits.length,
      withdrawalsCount: withdrawals.length,
      investmentsCount: investments.length,
      deposits,
      withdrawals,
      investments,
    };
    return { success: true, data };
  } catch (err) {
    console.error("[fetchUserDetail]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load user",
    };
  }
}
