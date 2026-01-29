import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | Tesla Share Hub Investment",
  description: "View and filter your transaction history, deposits, withdrawals, and top-ups.",
};

export default function DashboardTransactionsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
