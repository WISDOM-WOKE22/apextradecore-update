import { create } from "zustand";

export type UserRole = "admin" | "user";

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  country: string;
  phoneNumber: string;
  referralCode: string | null;
  role: UserRole;
  /** When true, this user does not see or pay withdrawal fee. */
  withdrawalFeeDisabled?: boolean;
  createdAt?: { seconds: number } | Date;
  updatedAt?: { seconds: number } | Date;
}

export interface AccountStats {
  accountBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  currentInvestments: number;
}

interface AppState {
  user: UserData | null;
  accountBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  currentInvestments: number;
  loading: boolean;
  error: string | null;

  setUser: (user: UserData | null) => void;
  setAccountStats: (stats: Partial<AccountStats>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  accountBalance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  totalInvested: 0,
  currentInvestments: 0,
  loading: true,
  error: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setAccountStats: (stats) =>
    set((state) => ({
      accountBalance: stats.accountBalance ?? state.accountBalance,
      totalDeposits: stats.totalDeposits ?? state.totalDeposits,
      totalWithdrawals: stats.totalWithdrawals ?? state.totalWithdrawals,
      totalInvested: stats.totalInvested ?? state.totalInvested,
      currentInvestments: stats.currentInvestments ?? state.currentInvestments,
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () => set({ ...initialState, loading: false }),
}));

/** Format currency for display */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format currency for display without showing negative values.
 * Uses Math.max(0, value) then filters out any '-' from the formatted string.
 * Use this for balance and stats that must never display as negative.
 */
export function formatCurrencyDisplay(value: number): string {
  const safe = Math.max(0, value);
  const formatted = formatCurrency(safe);
  return formatted
    .split("")
    .filter((ch) => ch !== "-")
    .join("");
}

/** Get initials from full name (e.g. "Ryan Crawford" -> "RC") */
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
