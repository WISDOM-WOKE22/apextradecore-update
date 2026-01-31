import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SignupSection } from "@/components/Signup";
import { Footer } from "@/components/Footer";

/** Avoid prerender: Firebase is used by SignupSection and fails at build when env vars are missing. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to start investing. Choose a plan, deposit, and track returns.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main>
        <SignupSection />
      </main>
      <Footer />
    </div>
  );
}
