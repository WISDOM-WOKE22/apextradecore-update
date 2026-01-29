import { Header } from "@/components/Header";
import { MembershipPlansSection } from "@/components/MembershipPlans";
import { EnterpriseCTA } from "@/components/EnterpriseCTA";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Invest Now | ApexTradeCore  Investment",
  description:
    "Choose your membership card investment plan. Deluxe, Standard, Premium, and Gold options with guaranteed returns.",
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
