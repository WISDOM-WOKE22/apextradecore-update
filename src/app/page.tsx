import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FinanceSecurity } from "@/components/FinanceSecurity";
import { ContactUs } from "@/components/ContactUs";
import { Footer } from "@/components/Footer";
import { getSiteDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description: getSiteDescription(),
  openGraph: { type: "website" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <FinanceSecurity />
        <ContactUs />
        <Footer />
      </main>
    </div>
  );
}
