import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | ApexTradeCore  Investment",
  description: "View and filter your transaction history, deposits, withdrawals, and top-ups.",
};

export default function TransactionsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
