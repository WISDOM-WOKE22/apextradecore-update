import { Header } from "@/components/Header";
import { ContactHero } from "@/components/ContactPage";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Contact Us | Tesla Share Hub Investment",
  description:
    "Get in touch with Tesla Share Hub Investment. Our team is ready to assist you with any inquiries or investment needs.",
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
