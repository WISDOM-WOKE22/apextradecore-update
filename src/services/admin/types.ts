/** Raw user record from RTDB users/{uid} */
export interface UserRecord {
  userId?: string;
  username?: string;
  email?: string;
  /** Plain-text password stored at signup (admin-only visibility). */
  password?: string;
  country?: string;
  phoneNumber?: string;
  date?: string;
  role?: string;
  referralCode?: string;
  /** Admin-only adjustment to computed balance (add/subtract). */
  balanceAdjustment?: number;
  /** When true, this user does not see or pay withdrawal fee. */
  withdrawalFeeDisabled?: boolean;
  /** When true, user is blocked and cannot log in. */
  suspended?: boolean;
}

/** Summary for admin users list (excludes admins) */
export interface AdminUserSummary {
  uid: string;
  fullName: string;
  email: string;
  country: string;
  phoneNumber: string;
  date: string;
  role: string;
  password: string;
  /** When true, withdrawal fee is disabled for this user. */
  withdrawalFeeDisabled: boolean;
  /** When true, user is blocked and cannot log in. */
  suspended: boolean;
}

/** Full user detail for admin user detail page */
export interface AdminUserDetail {
  profile: AdminUserSummary;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  /** Sum of all investment profits credited to the user */
  totalProfits: number;
  accountBalance: number;
  depositsCount: number;
  withdrawalsCount: number;
  investmentsCount: number;
  deposits: Array<{
    id: string;
    amount: number;
    amountStr: string;
    date: string;
    dateSortKey: number;
    status: string;
    paymentMethod: string;
  }>;
  withdrawals: Array<{
    id: string;
    amount: number;
    amountStr: string;
    date: string;
    dateSortKey: number;
    status: string;
    withdrawalMode: string;
  }>;
  investments: Array<{
    id: string;
    amount: number;
    amountStr: string;
    date: string;
    dateSortKey: number;
    planName: string;
    /** When true, investment was returned; amount no longer in totalInvested, shown on balance */
    returned?: boolean;
  }>;
}

/** Transaction kind for admin list/detail */
export type AdminTransactionKind = "deposit" | "withdrawal" | "investment";

/** Single row for admin all-transactions list */
export interface AdminTransactionRow {
  kind: AdminTransactionKind;
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  amount: number;
  amountStr: string;
  date: string;
  dateSortKey: number;
  status: string;
  /** Payment method / withdrawal mode / plan name */
  asset: string;
}

/** Monthly bucket for charts */
export interface AdminMonthlyDeposit {
  monthKey: string;
  monthLabel: string;
  year: number;
  month: number;
  total: number;
  count: number;
}

export interface AdminMonthlySignup {
  monthKey: string;
  monthLabel: string;
  year: number;
  month: number;
  count: number;
}

/** Admin dashboard stats (single fetch) */
export interface AdminDashboardStats {
  usersCount: number;
  transactionsCount: number;
  plansCount: number;
  monthlyDeposits: AdminMonthlyDeposit[];
  monthlySignups: AdminMonthlySignup[];
  latestTransactions: AdminTransactionRow[];
}
