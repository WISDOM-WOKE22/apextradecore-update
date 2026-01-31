import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans",
  description: "Manage investment plans and templates.",
};

export default function AdminPlansLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
