import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Tesla Share Hub Investment",
  description: "Manage your profile, password, and account settings.",
};

export default function DashboardSettingsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
