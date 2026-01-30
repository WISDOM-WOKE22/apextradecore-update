"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { AdminTransactionRow } from "./types";
import type { UserRecord } from "./types";
import type { DepositRecord, WithdrawalRecord } from "@/services/transactions/types";
import type { PlanRecord } from "@/services/plans/types";

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

export interface FetchAllTransactionsResult {
  transactions: AdminTransactionRow[];
  error?: string;
}

export async function fetchAllTransactions(): Promise<FetchAllTransactionsResult> {
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
    if (usersVal && typeof usersVal === "object") {
      for (const [uid, data] of Object.entries(usersVal)) {
        const role = (data?.role ?? "user").toLowerCase();
        if (role === "admin") continue;
        nonAdminUids.add(uid);
        userNames[uid] = {
          fullName: typeof data?.username === "string" ? data.username : "",
          email: typeof data?.email === "string" ? data.email : "",
        };
      }
    }

    const rows: AdminTransactionRow[] = [];

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
            status: "active",
            asset: p?.plan ?? "Starter",
          });
        }
      }
    }

    rows.sort((a, b) => b.dateSortKey - a.dateSortKey);
    return { transactions: rows };
  } catch (err) {
    console.error("[fetchAllTransactions]", err);
    return {
      transactions: [],
      error: err instanceof Error ? err.message : "Failed to load transactions",
    };
  }
}
