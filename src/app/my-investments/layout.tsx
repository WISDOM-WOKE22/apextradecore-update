import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Investments | Tesla Share Hub Investment",
  description:
    "View and track your investments, returns, timeline, and bonuses.",
};

export default function MyInvestmentsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
