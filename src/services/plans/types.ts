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
  /** When set to "returned", plan is excluded from totalInvested and amount is back on balance */
  status?: "active" | "returned";
  returnedAt?: number;
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
  /** True when investment was returned; amount is back on balance, excluded from totalInvested */
  returned?: boolean;
  /** Full record for detail view */
  record: PlanRecord;
}

/** Raw plan template from Realtime DB: planTemplates/{id} — admin-defined investment plan types */
export interface PlanTemplateRecord {
  name: string;
  minAmount: number;
  /** Expected return in dollars (e.g. 2000). Percentage is derived as (expectedReturn / minAmount) * 100 */
  expectedReturn?: number;
  /** Number of days until expected return is received */
  returnDays?: number;
  disabled?: boolean;
  order?: number;
  createdAt?: number;
}

/** Plan template for UI (with id) */
export interface PlanTemplate {
  id: string;
  name: string;
  minAmount: number;
  /** Expected return in dollars. Use expectedReturnPercent for display: (expectedReturn / minAmount) * 100 */
  expectedReturn: number;
  /** Number of days until expected return is received */
  returnDays: number;
  disabled: boolean;
  order: number;
  createdAt?: number;
}
