"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { useAppStore, type UserData } from "@/store/useAppStore";
import { DB } from "@/lib/realtime-db";

function getBalanceAdjustment(val: unknown): number {
  if (val == null || typeof val !== "object") return 0;
  const v = (val as { balanceAdjustment?: number }).balanceAdjustment;
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v) || 0;
  return 0;
}

/** Fetch deposits, withdrawals, plans and update account stats in the store. Call from anywhere to refresh balance without reload. */
export async function refreshAccountStats(uid: string): Promise<void> {
  const setAccountStats = useAppStore.getState().setAccountStats;
  try {
    const [userSnap, depositsSnap, withdrawalsSnap, plansSnap, profitsSnap] = await Promise.all([
      get(ref(database, DB.user(uid))),
      get(ref(database, DB.userDeposits(uid))),
      get(ref(database, DB.userWithdrawals(uid))),
      get(ref(database, DB.userPlans(uid))),
      get(ref(database, DB.userProfits(uid))),
    ]);
    const totalDeposits = sumApprovedAmounts(depositsSnap);
    const totalWithdrawals = sumApprovedAmounts(withdrawalsSnap);
    const totalInvested = sumPlanAmounts(plansSnap);
    const totalProfits = sumProfitAmounts(profitsSnap);
    const computed = totalDeposits - totalWithdrawals - totalInvested + totalProfits;
    const adjustment = getBalanceAdjustment(userSnap.val());
    const accountBalance = computed + adjustment;
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
  const roleRaw = data.role;
  const role: UserData["role"] =
    roleRaw === "admin" ? "admin" : "user";
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
    role,
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

function sumProfitAmounts(
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

const LOAD_USER_TIMEOUT_MS = 15_000;
const AUTH_INIT_TIMEOUT_MS = 8_000;

export function useLoadUserData() {
  const { setUser, setAccountStats, setLoading, setError, reset } = useAppStore();

  useEffect(() => {
    let authInitTimeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      setLoading(false);
    }, AUTH_INIT_TIMEOUT_MS);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (authInitTimeoutId) {
        clearTimeout(authInitTimeoutId);
        authInitTimeoutId = null;
      }
      if (!firebaseUser) {
        reset();
        setLoading(false);
        return;
      }

      // User is signed in; load profile and stats

      setLoading(true);
      setError(null);
      const uid = firebaseUser.uid;
      let timedOut = false;
      const timeoutId = setTimeout(() => {
        timedOut = true;
        setLoading(false);
        setError("Loading took too long. Please refresh.");
      }, LOAD_USER_TIMEOUT_MS);

      try {
        const userSnap = await get(ref(database, DB.user(uid)));
        if (timedOut) return;
        const userData = parseRtdbUser(uid, userSnap.val());
        if (!userData) {
          setUser(null);
          clearTimeout(timeoutId);
          setLoading(false);
          return;
        }
        setUser(userData);

        const [depositsSnap, withdrawalsSnap, plansSnap, profitsSnap] = await Promise.all([
          get(ref(database, DB.userDeposits(uid))),
          get(ref(database, DB.userWithdrawals(uid))),
          get(ref(database, DB.userPlans(uid))),
          get(ref(database, DB.userProfits(uid))),
        ]);
        if (timedOut) return;

        const totalDeposits = sumApprovedAmounts(depositsSnap);
        const totalWithdrawals = sumApprovedAmounts(withdrawalsSnap);
        const totalInvested = sumPlanAmounts(plansSnap);
        const totalProfits = sumProfitAmounts(profitsSnap);
        const computed = totalDeposits - totalWithdrawals - totalInvested + totalProfits;
        const adjustment = getBalanceAdjustment(userSnap.val());
        const accountBalance = computed + adjustment;
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
        if (!timedOut) {
          console.error("[loadUserData]", err);
          setError(err instanceof Error ? err.message : "Failed to load user");
        }
      } finally {
        clearTimeout(timeoutId);
        if (!timedOut) setLoading(false);
      }
    });

    return () => {
      if (authInitTimeoutId) clearTimeout(authInitTimeoutId);
      unsubscribe();
    };
  }, [setUser, setAccountStats, setLoading, setError, reset]);
}
