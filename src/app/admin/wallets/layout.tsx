import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallets",
  description: "Manage wallet addresses and balances.",
};

export default function AdminWalletsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
