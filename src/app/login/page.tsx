import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LoginSection } from "@/components/Login";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access your dashboard, investments, deposits, and withdrawals.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main>
        <LoginSection />
      </main>
      <Footer />
    </div>
  );
}
