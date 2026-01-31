import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Set a new password for your account using the link sent to your email.",
};

export default function ResetPasswordLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
