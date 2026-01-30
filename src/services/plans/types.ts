/**
 * Raw plan record from Realtime DB: Plans/{uid}/{planKey}
 * Matches structure: amount, date, name, plan (e.g. "Starter"), totalProfit (optional)
 */
export interface PlanRecord {
  amount: string;
  date: string;
  createdAt?: number;
  name: number;
  plan: string;
  /** Running total of profit credited to this plan (admin-added) */
  totalProfit?: number;
}

/** Unified plan for UI: from DB or default */
export interface UserPlan {
  id: string;
  planName: string;
  amount: string;
  amountNum: number;
  date: string;
  dateSortKey: number;
  /** Plan index/name from DB (e.g. 1, 2) */
  name: number;
  /** True when this is the default (Starter) placeholder for users with no plans yet */
  isDefault: boolean;
  /** Total profit credited to this plan */
  totalProfit: number;
  /** Full record for detail view */
  record: PlanRecord;
}
