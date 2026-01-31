import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Admin account and application settings.",
};

export default function AdminSettingsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
