import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | ApexTradeCore  Investment",
  description: "Manage your profile, password, and account settings.",
};

export default function SettingsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
