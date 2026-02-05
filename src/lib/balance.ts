/**
 * Special balance rule: one user gets balance = profits + deposits - withdrawals
 * + investment returns (invested amount is NOT subtracted). All other users use the standard formula.
 */
export const SPECIAL_BALANCE_USER_UID = "yAVYye37xjezGLBGuDBoHLh0Lb12" as const;

export function computeAccountBalance(params: {
  uid: string;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvested: number;
  totalProfits: number;
  adjustment: number;
  /** For SPECIAL_BALANCE_USER_UID only: sum of investment return amounts to add to balance */
  totalInvestmentReturns?: number;
}): number {
  const {
    uid,
    totalDeposits,
    totalWithdrawals,
    totalInvested,
    totalProfits,
    adjustment,
    totalInvestmentReturns = 0,
  } = params;
  let computed =
    uid === SPECIAL_BALANCE_USER_UID
      ? totalDeposits - totalWithdrawals + totalProfits
      : totalDeposits - totalWithdrawals - totalInvested + totalProfits;
  if (uid === SPECIAL_BALANCE_USER_UID && totalInvestmentReturns > 0) {
    computed += totalInvestmentReturns;
  }
  return computed + adjustment;
}
