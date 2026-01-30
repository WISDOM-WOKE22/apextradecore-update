/**
 * Realtime Database paths and helpers.
 * Matches existing DB structure: users, depositeTransactions/Trading, withdrawals.
 */

export const DB = {
  users: "users",
  user: (uid: string) => `users/${uid}`,

  /** depositeTransactions.Trading.{userId}.{transactionId} */
  depositTransactions: "depositeTransactions/Trading",
  userDeposits: (uid: string) => `depositeTransactions/Trading/${uid}`,
  userDeposit: (uid: string, txId: string) =>
    `depositeTransactions/Trading/${uid}/${txId}`,

  /** withdrawals.{userId}.{timestamp} */
  withdrawals: "withdrawals",
  userWithdrawals: (uid: string) => `withdrawals/${uid}`,
  userWithdrawal: (uid: string, timestamp: number) =>
    `withdrawals/${uid}/${timestamp}`,

  /** Plans.{userId}.{planKey} — each plan: amount, date, name, plan (e.g. "Starter") */
  plans: "Plans",
  userPlans: (uid: string) => `Plans/${uid}`,
  userPlan: (uid: string, planKey: string) => `Plans/${uid}/${planKey}`,
} as const;

/** Format date like existing DB: "16-7-2025" */
export function formatDbDate(date: Date = new Date()): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}
