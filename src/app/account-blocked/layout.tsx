import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account blocked",
  description: "Your account has been suspended. Please contact the administrator.",
  robots: { index: false, follow: false },
};

export default function AccountBlockedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
