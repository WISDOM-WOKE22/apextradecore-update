import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { MembershipPlansSection } from "@/components/MembershipPlans";
import { EnterpriseCTA } from "@/components/EnterpriseCTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Invest Now",
  description:
    "Choose your membership plan: Deluxe, Standard, Premium, and Gold. Flexible terms and returns.",
};

export default function InvestNowPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main>
        <MembershipPlansSection />
        <EnterpriseCTA />
      </main>
      <Footer />
    </div>
  );
}
