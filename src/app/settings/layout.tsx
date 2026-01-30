import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { UserAreaGuard } from "@/components/guard";

export const metadata: Metadata = {
  title: "Settings | ApexTradeCore  Investment",
  description: "Manage your profile, password, and account settings.",
};

export default async function SettingsLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) redirect("/login");
  return <UserAreaGuard>{children}</UserAreaGuard>;
}
