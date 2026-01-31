import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View your transaction and plan notifications.",
  robots: { index: false, follow: false },
};

export default function DashboardNotificationsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
