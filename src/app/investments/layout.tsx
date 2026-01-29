import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investments | ApexTradeCore  Investment",
  description:
    "View available investment plans. Choose a plan, deposit the required amount, and start your investment. Make a deposit if your balance is insufficient.",
};

export default function InvestmentsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
