import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deposit | ApexTradeCore  Investment",
  description: "Deposit funds into your account. Select currency, amount, and complete your deposit.",
};

export default function DepositLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
