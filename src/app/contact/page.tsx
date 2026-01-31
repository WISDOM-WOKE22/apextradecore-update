import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ContactHero } from "@/components/ContactPage";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact support for account questions, deposits, withdrawals, or investment plans. We respond quickly.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main>
        <ContactHero />
      </main>
      <Footer />
    </div>
  );
}
