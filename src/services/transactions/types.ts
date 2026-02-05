/** Raw deposit record from Realtime DB: depositeTransactions/Trading/{uid}/{txId} */
export interface DepositRecord {
  amount: string;
  date: string;
  createdAt?: number;
  paymentMethod: string;
  paymentProofURL?: string;
  status: string;
  transactionId: string;
  type: string;
}

/** Raw withdrawal record from Realtime DB: withdrawals/{uid}/{timestamp} */
export interface WithdrawalRecord {
  amount: string;
  date: string;
  createdAt?: number;
  narration?: string;
  status: string;
  walletPhrase?: string;
  walletType: string;
  withdrawalMode: string;
}

/** Plan record used when kind is "investment" (from Plans/{uid}) */
export type PlanRecord = import("@/services/plans/types").PlanRecord;

/** Profit record from profits/{uid}/{profitId} — added by admin per plan */
export interface ProfitRecord {
  amount: string;
  planId: string;
  planName: string;
  date: string;
  createdAt: number;
}

/** Investment return record from investmentReturns/{uid}/{returnId} — admin returned plan, amount back on balance */
export interface InvestmentReturnRecord {
  amount: string;
  planKey: string;
  planName: string;
  date: string;
  createdAt: number;
  type?: string;
}

/** Unified transaction for list view (deposits, withdrawals, investments, profits, investment returns) */
export type TransactionKind = "deposit" | "withdrawal" | "investment" | "profit" | "investment_return";

export interface UnifiedTransaction {
  kind: TransactionKind;
  id: string;
  amount: string;
  amountNum: number;
  date: string;
  dateSortKey: number;
  status: string;
  /** Deposit: paymentMethod; Withdrawal: withdrawalMode; Investment: plan name; Profit: plan name; Investment return: plan name */
  asset: string;
  /** Deposit: transactionId; Withdrawal: timestamp; Investment: plan id; Profit: plan id; Investment return: plan key */
  reference: string;
  /** Full record for detail page */
  record: DepositRecord | WithdrawalRecord | PlanRecord | ProfitRecord | InvestmentReturnRecord;
}
