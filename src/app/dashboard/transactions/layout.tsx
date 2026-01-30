import type { Metadata } from "next";
import { TransactionsChrome } from "./TransactionsChrome";

export const metadata: Metadata = {
  title: "Transactions | ApexTradeCore Investment",
  description: "View and filter your transaction history, deposits, and withdrawals.",
};

export default function DashboardTransactionsLayout({
  children,
}: { children: React.ReactNode }) {
  return <TransactionsChrome>{children}</TransactionsChrome>;
}
