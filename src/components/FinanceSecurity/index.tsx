"use client";

import { motion } from "motion/react";
import { TrustpilotWidget } from "./TrustpilotWidget";
import { UserInsightCard } from "./UserInsightCard";

const HEADLINE = "Your finances, safe and secure";
const BODY =
  "Varius nisi aliquet at nisi augue tempus. Eu vitae maecenas tellus varius quis pretium.";

export function FinanceSecurity() {
  return (
    <section className="w-full bg-surface-alt px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[28px] bg-linear-to-r from-[#b8543a] via-[#8b4a5c] to-[#2d3a6e] shadow-[0_24px_64px_rgba(45,58,110,0.25)]"
        >
          <div className="grid min-h-[320px] grid-cols-1 gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12">
            <div className="flex max-w-[520px] flex-col gap-6">
              <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
                {HEADLINE}
              </h2>
              <p className="text-lg leading-relaxed text-white/90">
                {BODY}
              </p>
              <TrustpilotWidget />
            </div>
            <div className="flex items-center justify-end lg:justify-center">
              <UserInsightCard />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
