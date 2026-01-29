"use client";

import { motion } from "motion/react";
import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";

export function ContactHero() {
  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-[#f9fafb] via-[#f0fdf4] to-[#dcfce7]">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #10B981 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1120px] grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16 lg:px-10 lg:py-20">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}
