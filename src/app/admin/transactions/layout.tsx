import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Review and manage deposits, withdrawals, and investments.",
};

export default function AdminTransactionsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
