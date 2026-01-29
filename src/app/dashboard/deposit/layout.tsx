import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deposit | Tesla Share Hub Investment",
  description: "Deposit funds into your account. Select currency, amount, and complete your deposit.",
};

export default function DashboardDepositLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
