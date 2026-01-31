import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ForgotPasswordSection } from "@/components/ForgotPassword";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Enter your email to receive a password reset link and regain access to your account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main>
        <ForgotPasswordSection />
      </main>
      <Footer />
    </div>
  );
}
