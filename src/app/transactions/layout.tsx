import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { UserAreaGuard } from "@/components/guard";

export const metadata: Metadata = {
  title: "Transactions",
  description: "View and filter your transaction history, deposits, withdrawals, and top-ups.",
  robots: { index: false, follow: false },
};

export default async function TransactionsLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) redirect("/login");
  return <UserAreaGuard>{children}</UserAreaGuard>;
}
