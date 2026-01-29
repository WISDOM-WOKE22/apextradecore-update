import { Header } from "@/components/Header";
import { SignupSection } from "@/components/Signup";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Sign Up | ApexTradeCore  Investment",
  description:
    "Create your account and join ApexTradeCore  Investment. Start your financial journey with exclusive investment opportunities.",
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
