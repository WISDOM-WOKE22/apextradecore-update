import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | ApexTradeCore Investment",
  description: "View your transaction and plan notifications.",
};

export default function DashboardNotificationsLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
