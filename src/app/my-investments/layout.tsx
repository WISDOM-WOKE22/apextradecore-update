import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { UserAreaGuard } from "@/components/guard";

export const metadata: Metadata = {
  title: "My Investments",
  description: "View and track your investments, returns, timeline, and bonuses.",
  robots: { index: false, follow: false },
};

export default async function MyInvestmentsLayout({
  children,
}: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) redirect("/login");
  return <UserAreaGuard>{children}</UserAreaGuard>;
}
