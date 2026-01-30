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

/** Unified transaction for list view (deposits, withdrawals, investments) */
export type TransactionKind = "deposit" | "withdrawal" | "investment";

export interface UnifiedTransaction {
  kind: TransactionKind;
  id: string;
  amount: string;
  amountNum: number;
  date: string;
  dateSortKey: number;
  status: string;
  /** Deposit: paymentMethod; Withdrawal: withdrawalMode; Investment: plan name */
  asset: string;
  /** Deposit: transactionId; Withdrawal: timestamp; Investment: plan id */
  reference: string;
  /** Full record for detail page */
  record: DepositRecord | WithdrawalRecord | PlanRecord;
}
