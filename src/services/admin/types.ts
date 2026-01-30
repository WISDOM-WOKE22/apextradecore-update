/** Raw user record from RTDB users/{uid} */
export interface UserRecord {
  userId?: string;
  username?: string;
  email?: string;
  country?: string;
  phoneNumber?: string;
  date?: string;
  role?: string;
  referralCode?: string;
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
}

/** Full user detail for admin user detail page */
export interface AdminUserDetail {
  profile: AdminUserSummary;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
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
