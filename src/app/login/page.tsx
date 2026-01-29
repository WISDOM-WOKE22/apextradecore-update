import { Header } from "@/components/Header";
import { LoginSection } from "@/components/Login";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Sign In | Tesla Share Hub Investment",
  description:
    "Sign in to your Tesla Share Hub Investment account to access your dashboard and investment portfolio.",
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
