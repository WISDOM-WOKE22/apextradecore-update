"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type {
  AdminTransactionRow,
  AdminDashboardStats,
  AdminMonthlyDeposit,
  AdminMonthlySignup,
  UserRecord,
} from "./types";
import type { DepositRecord, WithdrawalRecord } from "@/services/transactions/types";
import type { PlanRecord } from "@/services/plans/types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_MONTHS = 12;

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

function normalizeStatus(s: string): string {
  const lower = (s ?? "").toLowerCase();
  if (lower === "approved" || lower === "completed") return "completed";
  if (lower === "pending") return "pending";
  if (lower === "failed" || lower === "rejected") return "failed";
  return lower || "pending";
}

function getYearMonthFromSortKey(dateSortKey: number): { year: number; month: number } {
  const d = new Date(dateSortKey);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function getYearMonthFromDateStr(dateStr: string): { year: number; month: number } | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return null;
  const [, m, y] = parts;
  if (!y || !m) return null;
  return { year: y, month: m };
}

function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function monthLabel(year: number, month: number): string {
  const shortYear = String(year).slice(-2);
  return `${MONTH_LABELS[month - 1] ?? month} ${shortYear}`;
}

export interface FetchAdminDashboardStatsResult {
  success: true;
  data: AdminDashboardStats;
}

export interface FetchAdminDashboardStatsError {
  success: false;
  error: string;
}

export type FetchAdminDashboardStatsResponse =
  | FetchAdminDashboardStatsResult
  | FetchAdminDashboardStatsError;

export async function fetchAdminDashboardStats(): Promise<FetchAdminDashboardStatsResponse> {
  try {
    const [usersSnap, depositsRootSnap, withdrawalsRootSnap, plansRootSnap] = await Promise.all([
      get(ref(database, DB.users)),
      get(ref(database, DB.depositTransactions)),
      get(ref(database, DB.withdrawals)),
      get(ref(database, DB.plans)),
    ]);

    const usersVal = usersSnap.val() as Record<string, UserRecord> | null;
    const depositsRoot = depositsRootSnap.val() as Record<string, Record<string, DepositRecord>> | null;
    const withdrawalsRoot = withdrawalsRootSnap.val() as Record<string, Record<string, WithdrawalRecord>> | null;
    const plansRoot = plansRootSnap.val() as Record<string, Record<string, PlanRecord>> | null;

    const nonAdminUids = new Set<string>();
    const userNames: Record<string, { fullName: string; email: string }> = {};
    const signupMonths: { year: number; month: number }[] = [];

    if (usersVal && typeof usersVal === "object") {
      for (const [uid, data] of Object.entries(usersVal)) {
        const role = (data?.role ?? "user").toLowerCase();
        if (role === "admin") continue;
        nonAdminUids.add(uid);
        userNames[uid] = {
          fullName: typeof data?.username === "string" ? data.username : "",
          email: typeof data?.email === "string" ? data.email : "",
        };
        const parsed = getYearMonthFromDateStr(data?.date ?? "");
        if (parsed) signupMonths.push(parsed);
      }
    }

    const depositByMonth = new Map<string, { total: number; count: number }>();
    const now = new Date();
    const currentSortKey = now.getFullYear() * 12 + (now.getMonth() + 1);
    for (let i = CHART_MONTHS - 1; i >= 0; i--) {
      const sortKey = currentSortKey - i;
      const year = Math.floor(sortKey / 12);
      const month = sortKey % 12 || 12;
      const key = monthKey(year, month);
      depositByMonth.set(key, { total: 0, count: 0 });
    }

    const rows: AdminTransactionRow[] = [];
    let plansCount = 0;

    if (depositsRoot && typeof depositsRoot === "object") {
      for (const [uid, txs] of Object.entries(depositsRoot)) {
        if (!nonAdminUids.has(uid) || !txs || typeof txs !== "object") continue;
        const { fullName = "", email = "" } = userNames[uid] ?? {};
        for (const [id, d] of Object.entries(txs)) {
          const amount = parseFloat(String(d?.amount ?? 0)) || 0;
          const dateStr = d?.date ?? "";
          const dateSortKey =
            typeof (d as { createdAt?: number }).createdAt === "number"
              ? (d as { createdAt?: number }).createdAt!
              : parseDbDateToMs(dateStr);
          const { year, month } = getYearMonthFromSortKey(dateSortKey || Date.now());
          const key = monthKey(year, month);
          const bucket = depositByMonth.get(key);
          if (bucket) {
            bucket.total += amount;
            bucket.count += 1;
          } else {
            depositByMonth.set(key, { total: amount, count: 1 });
          }
          rows.push({
            kind: "deposit",
            id,
            userId: uid,
            userFullName: fullName,
            userEmail: email,
            amount,
            amountStr: amount.toFixed(2),
            date: formatDateStr(dateStr, dateSortKey),
            dateSortKey,
            status: normalizeStatus(d?.status ?? "pending"),
            asset: d?.paymentMethod ?? "—",
          });
        }
      }
    }

    if (withdrawalsRoot && typeof withdrawalsRoot === "object") {
      for (const [uid, txs] of Object.entries(withdrawalsRoot)) {
        if (!nonAdminUids.has(uid) || !txs || typeof txs !== "object") continue;
        const { fullName = "", email = "" } = userNames[uid] ?? {};
        for (const [id, w] of Object.entries(txs)) {
          const amount = parseFloat(String(w?.amount ?? 0)) || 0;
          const dateStr = w?.date ?? "";
          const dateSortKey =
            typeof (w as { createdAt?: number }).createdAt === "number"
              ? (w as { createdAt?: number }).createdAt!
              : parseDbDateToMs(dateStr) || parseInt(id, 10) || 0;
          rows.push({
            kind: "withdrawal",
            id,
            userId: uid,
            userFullName: fullName,
            userEmail: email,
            amount,
            amountStr: amount.toFixed(2),
            date: formatDateStr(dateStr, dateSortKey),
            dateSortKey,
            status: normalizeStatus(w?.status ?? "pending"),
            asset: w?.withdrawalMode ?? w?.walletType ?? "—",
          });
        }
      }
    }

    if (plansRoot && typeof plansRoot === "object") {
      for (const [uid, planMap] of Object.entries(plansRoot)) {
        if (!nonAdminUids.has(uid) || !planMap || typeof planMap !== "object") continue;
        const { fullName = "", email = "" } = userNames[uid] ?? {};
        for (const [id, p] of Object.entries(planMap)) {
          const returned = (p as { status?: string }).status === "returned";
          if (!returned) plansCount += 1;
          const amount = parseFloat(String(p?.amount ?? 0)) || 0;
          const dateStr = p?.date ?? "";
          const dateSortKey =
            typeof (p as { createdAt?: number }).createdAt === "number"
              ? (p as { createdAt?: number }).createdAt!
              : parseDbDateToMs(dateStr);
          rows.push({
            kind: "investment",
            id,
            userId: uid,
            userFullName: fullName,
            userEmail: email,
            amount,
            amountStr: amount.toFixed(2),
            date: formatDateStr(dateStr, dateSortKey),
            dateSortKey,
            status: returned ? "returned" : "active",
            asset: p?.plan ?? "Starter",
          });
        }
      }
    }

    rows.sort((a, b) => b.dateSortKey - a.dateSortKey);
    const latestTransactions = rows.slice(0, 5);

    const signupByMonth = new Map<string, number>();
    for (const { year, month } of signupMonths) {
      const key = monthKey(year, month);
      signupByMonth.set(key, (signupByMonth.get(key) ?? 0) + 1);
    }

    const monthlyDeposits: AdminMonthlyDeposit[] = [];
    for (let i = CHART_MONTHS - 1; i >= 0; i--) {
      const sortKey = currentSortKey - i;
      const year = Math.floor(sortKey / 12);
      const month = sortKey % 12 || 12;
      const key = monthKey(year, month);
      const bucket = depositByMonth.get(key) ?? { total: 0, count: 0 };
      monthlyDeposits.push({
        monthKey: key,
        monthLabel: monthLabel(year, month),
        year,
        month,
        total: bucket.total,
        count: bucket.count,
      });
    }

    const monthlySignups: AdminMonthlySignup[] = [];
    for (let i = CHART_MONTHS - 1; i >= 0; i--) {
      const sortKey = currentSortKey - i;
      const year = Math.floor(sortKey / 12);
      const month = sortKey % 12 || 12;
      const key = monthKey(year, month);
      monthlySignups.push({
        monthKey: key,
        monthLabel: monthLabel(year, month),
        year,
        month,
        count: signupByMonth.get(key) ?? 0,
      });
    }

    const data: AdminDashboardStats = {
      usersCount: nonAdminUids.size,
      transactionsCount: rows.length,
      plansCount,
      monthlyDeposits,
      monthlySignups,
      latestTransactions,
    };

    return { success: true, data };
  } catch (err) {
    console.error("[fetchAdminDashboardStats]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load dashboard stats",
    };
  }
}
