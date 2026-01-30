import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminGuard } from "@/components/guard";
import { AdminChrome } from "@/components/Admin";

export const metadata = {
  title: "Admin | ApexTradeCore",
  description: "Admin dashboard and management.",
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
