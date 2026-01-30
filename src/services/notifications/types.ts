/** Notification type for user-facing messages */
export type NotificationType =
  | "deposit_approved"
  | "deposit_rejected"
  | "withdrawal_approved"
  | "withdrawal_rejected"
  | "plan_profit";

/** Raw notification record in Realtime DB: notifications/{uid}/{notificationId} */
export interface NotificationRecord {
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  /** Optional link path (e.g. /dashboard/transactions/deposit/123) */
  link?: string;
}

/** Notification with id for list/detail */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  link?: string;
}
