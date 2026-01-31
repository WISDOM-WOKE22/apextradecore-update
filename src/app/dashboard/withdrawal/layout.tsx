import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdrawal",
  description: "Withdraw funds. Select currency, amount, and authorize your withdrawal.",
  robots: { index: false, follow: false },
};

export default function DashboardWithdrawalLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
