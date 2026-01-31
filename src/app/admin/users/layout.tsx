import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage user accounts, profiles, and balances.",
};

export default function AdminUsersLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
