import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdrawal | Tesla Share Hub Investment",
  description: "Withdraw funds to your account. Select currency, amount, and authorize your withdrawal.",
};

export default function DashboardWithdrawalLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
