"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { useAppStore, type UserData } from "@/store/useAppStore";
import { DB } from "@/lib/realtime-db";

/** Fetch deposits, withdrawals, plans and update account stats in the store. Call from anywhere to refresh balance without reload. */
export async function refreshAccountStats(uid: string): Promise<void> {
  const setAccountStats = useAppStore.getState().setAccountStats;
  try {
    const [depositsSnap, withdrawalsSnap, plansSnap] = await Promise.all([
      get(ref(database, DB.userDeposits(uid))),
      get(ref(database, DB.userWithdrawals(uid))),
      get(ref(database, DB.userPlans(uid))),
    ]);
    const totalDeposits = sumApprovedAmounts(depositsSnap);
    const totalWithdrawals = sumApprovedAmounts(withdrawalsSnap);
    const totalInvested = sumPlanAmounts(plansSnap);
    const accountBalance = totalDeposits - totalWithdrawals - totalInvested;
    const plansVal = plansSnap.val();
    const currentInvestments =
      plansVal && typeof plansVal === "object" ? Object.keys(plansVal).length : 0;
    setAccountStats({
      accountBalance,
      totalDeposits,
      totalWithdrawals,
      totalInvested,
      currentInvestments,
    });
  } catch (err) {
    console.error("[refreshAccountStats]", err);
  }
}

function parseRtdbUser(uid: string, data: Record<string, unknown> | null): UserData | null {
  if (!data) return null;
  return {
    uid,
    email: typeof data.email === "string" ? data.email : "",
    fullName: typeof data.username === "string" ? data.username : "",
    country: typeof data.country === "string" ? data.country : "",
    phoneNumber: typeof data.phoneNumber === "string" ? data.phoneNumber : "",
    referralCode:
      typeof data.referralCode === "string" && data.referralCode
        ? data.referralCode
        : null,
  };
}

function isApprovedStatus(s: string): boolean {
  const lower = (s ?? "").toLowerCase();
  return lower === "approved" || lower === "completed";
}

function sumApprovedAmounts(
  snapshot: { val: () => Record<string, { amount?: string | number; status?: string }> | null }
): number {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return 0;
  return Object.values(val).reduce((sum, item) => {
    if (!isApprovedStatus(item?.status ?? "")) return sum;
    const amt = item?.amount;
    if (typeof amt === "number") return sum + amt;
    if (typeof amt === "string") return sum + (parseFloat(amt) || 0);
    return sum;
  }, 0);
}

function sumPlanAmounts(
  snapshot: { val: () => Record<string, { amount?: string | number }> | null }
): number {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return 0;
  return Object.values(val).reduce((sum, item) => {
    const amt = item?.amount;
    if (typeof amt === "number") return sum + amt;
    if (typeof amt === "string") return sum + (parseFloat(amt) || 0);
    return sum;
  }, 0);
}

export function useLoadUserData() {
  const { setUser, setAccountStats, setLoading, setError, reset } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        reset();
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      const uid = firebaseUser.uid;

      try {
        const userSnap = await get(ref(database, DB.user(uid)));
        const userData = parseRtdbUser(uid, userSnap.val());
        if (!userData) {
          setUser(null);
          setLoading(false);
          return;
        }
        setUser(userData);

        const [depositsSnap, withdrawalsSnap, plansSnap] = await Promise.all([
          get(ref(database, DB.userDeposits(uid))),
          get(ref(database, DB.userWithdrawals(uid))),
          get(ref(database, DB.userPlans(uid))),
        ]);

        const totalDeposits = sumApprovedAmounts(depositsSnap);
        const totalWithdrawals = sumApprovedAmounts(withdrawalsSnap);
        const totalInvested = sumPlanAmounts(plansSnap);
        const accountBalance = totalDeposits - totalWithdrawals - totalInvested;
        const plansVal = plansSnap.val();
        const currentInvestments =
          plansVal && typeof plansVal === "object" ? Object.keys(plansVal).length : 0;

        setAccountStats({
          accountBalance,
          totalDeposits,
          totalWithdrawals,
          totalInvested,
          currentInvestments,
        });
      } catch (err) {
        console.error("[loadUserData]", err);
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setAccountStats, setLoading, setError, reset]);
}
