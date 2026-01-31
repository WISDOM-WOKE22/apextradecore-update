import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LoginSection } from "@/components/Login";
import { Footer } from "@/components/Footer";

/** Avoid prerender: Firebase is used by LoginSection and fails at build when env vars are missing. */
export const dynamic = "force-dynamic";

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
