import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminGuard } from "@/components/guard";
import { AdminChrome } from "@/components/Admin";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard: users, wallets, plans, and transactions.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <AdminGuard>
      <AdminChrome>{children}</AdminChrome>
    </AdminGuard>
  );
}
