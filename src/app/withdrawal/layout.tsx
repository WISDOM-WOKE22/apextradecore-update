import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { UserAreaGuard } from "@/components/guard";

export const metadata: Metadata = {
  title: "Withdrawal | ApexTradeCore  Investment",
  description: "Withdraw funds from your account.",
};

export default async function WithdrawalLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) redirect("/login");
  return <UserAreaGuard>{children}</UserAreaGuard>;
}
