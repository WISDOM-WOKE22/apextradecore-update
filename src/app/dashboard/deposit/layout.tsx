import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deposit",
  description: "Deposit funds into your account. Select currency, amount, and complete your deposit.",
  robots: { index: false, follow: false },
};

export default function DashboardDepositLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
