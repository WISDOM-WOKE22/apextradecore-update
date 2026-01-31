import type { Metadata } from "next";
import { TransactionsChrome } from "./TransactionsChrome";

export const metadata: Metadata = {
  title: "Transactions",
  description: "View and filter your transaction history, deposits, and withdrawals.",
  robots: { index: false, follow: false },
};

export default function DashboardTransactionsLayout({
  children,
}: { children: React.ReactNode }) {
  return <TransactionsChrome>{children}</TransactionsChrome>;
}
