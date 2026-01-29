import { Header } from "@/components/Header";
import { ForgotPasswordSection } from "@/components/ForgotPassword";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Forgot Password | ApexTradeCore  Investment",
  description:
    "Reset your password for your ApexTradeCore  Investment account. Enter your email to receive a password reset link.",
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
