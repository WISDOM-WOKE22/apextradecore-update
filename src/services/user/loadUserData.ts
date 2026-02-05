"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { useAppStore, type UserData } from "@/store/useAppStore";
import { computeAccountBalance, SPECIAL_BALANCE_USER_UID } from "@/lib/balance";
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
    const adjustment = getBalanceAdjustment(userSnap.val());
    let totalInvestmentReturns = 0;
    if (uid === SPECIAL_BALANCE_USER_UID) {
      const returnsSnap = await get(ref(database, DB.userInvestmentReturns(uid)));
      totalInvestmentReturns = sumInvestmentReturnAmounts(returnsSnap);
    }
    const accountBalance = computeAccountBalance({
      uid,
      totalDeposits,
      totalWithdrawals,
      totalInvested,
      totalProfits,
      adjustment,
      totalInvestmentReturns,
    });
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
  const withdrawalFeeDisabled =
    data.withdrawalFeeDisabled === true || data.withdrawalFeeDisabled === "true";
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
    withdrawalFeeDisabled: withdrawalFeeDisabled || undefined,
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
  snapshot: { val: () => Record<string, { amount?: string | number; status?: string }> | null }
): number {
  const val = snapshot.val();
  if (!val || typeof val !== "object") return 0;
  return Object.values(val).reduce((sum, item) => {
    if ((item as { status?: string }).status === "returned") return sum;
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

function sumInvestmentReturnAmounts(
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

const SUSPENDED_MESSAGE =
  "Your account has been suspended. Please contact the administrator or company personnel.";

export function useLoadUserData() {
  const { setUser, setAccountStats, setLoading, setError, setSuspendedMessage, reset } = useAppStore();

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
        const userVal = userSnap.val() as Record<string, unknown> | null;
        const userData = parseRtdbUser(uid, userVal);
        if (!userData) {
          setUser(null);
          clearTimeout(timeoutId);
          setLoading(false);
          return;
        }
        if (userVal && userVal.suspended === true) {
          clearTimeout(timeoutId);
          setSuspendedMessage(SUSPENDED_MESSAGE);
          setUser(null);
          setLoading(false);
          // Guard will redirect to /account-blocked via client-side navigation (no reload)
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
        const adjustment = getBalanceAdjustment(userSnap.val());
        let totalInvestmentReturns = 0;
        if (uid === SPECIAL_BALANCE_USER_UID) {
          const returnsSnap = await get(ref(database, DB.userInvestmentReturns(uid)));
          totalInvestmentReturns = sumInvestmentReturnAmounts(returnsSnap);
        }
        const accountBalance = computeAccountBalance({
          uid,
          totalDeposits,
          totalWithdrawals,
          totalInvested,
          totalProfits,
          adjustment,
          totalInvestmentReturns,
        });
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
  }, [setUser, setAccountStats, setLoading, setError, setSuspendedMessage, reset]);
}
