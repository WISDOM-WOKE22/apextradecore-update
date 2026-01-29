"use client";

import { motion } from "motion/react";
import { LoginForm } from "./LoginForm";

export function LoginSection() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-alt">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f9fafb] via-white to-[#f0fdf4] opacity-50" />
      
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, #10B981 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-144px)] max-w-[1120px] items-center justify-center px-6 py-12 sm:py-16 lg:px-10">
        <LoginForm />
      </div>
    </section>
  );
}
