import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UserAreaGuard } from "@/components/guard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your portfolio, view balances, and track investments.",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <UserAreaGuard>{children}</UserAreaGuard>;
}
