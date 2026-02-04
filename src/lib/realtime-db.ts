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
  userWithdrawal: (uid: string, withdrawalId: string | number) =>
    `withdrawals/${uid}/${withdrawalId}`,

  /** Plans.{userId}.{planKey} — each plan: amount, date, name, plan (e.g. "Starter") */
  plans: "Plans",
  userPlans: (uid: string) => `Plans/${uid}`,
  userPlan: (uid: string, planKey: string) => `Plans/${uid}/${planKey}`,

  /** Deposit wallets (admin-managed). wallets.{walletId} */
  wallets: "wallets",
  wallet: (id: string) => `wallets/${id}`,

  /** Profit credits per user (added by admin per plan). profits.{uid}.{profitId} */
  profits: "profits",
  userProfits: (uid: string) => `profits/${uid}`,
  userProfit: (uid: string, profitId: string) => `profits/${uid}/${profitId}`,

  /** User notifications. notifications.{uid}.{notificationId} */
  notifications: "notifications",
  userNotifications: (uid: string) => `notifications/${uid}`,
  userNotification: (uid: string, notificationId: string) => `notifications/${uid}/${notificationId}`,

  /** Investment plan templates (admin-managed). planTemplates.{templateId} */
  planTemplates: "planTemplates",
  planTemplate: (id: string) => `planTemplates/${id}`,

  /** App settings (admin-managed). settings.withdrawalFeePercent = number (0–100) */
  settings: "settings",
  withdrawalFeePercent: "settings/withdrawalFeePercent",
} as const;

/** Format date like existing DB: "16-7-2025" */
export function formatDbDate(date: Date = new Date()): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}
