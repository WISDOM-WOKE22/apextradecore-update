"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

const HEADLINE = "Are you an enterprise and need a custom plan?";
const DESCRIPTION =
  "At Tesla ShareHubs Investments, we understand that businesses have unique financial needs. That's why we offer tailored investment solutions designed to fit your specific goals, whether you're looking for scalable growth, enhanced cash flow, or strategic financial planning";

export function EnterpriseCTA() {
  return (
    <section className="w-full bg-surface-alt px-6 py-16 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#1e3a8a] via-[#3b82f6] to-[#6366f1] shadow-[0_24px_64px_rgba(30,58,138,0.25)]"
        >
          {/* Dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px",
            }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-[800px] px-8 py-16 text-center sm:px-12 sm:py-20 lg:px-16 lg:py-24">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-white"
            >
              {HEADLINE}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-[680px] text-lg leading-relaxed text-white/95 sm:text-xl sm:leading-relaxed"
            >
              At{" "}
              <span className="font-bold text-white">Tesla ShareHubs Investments</span>
              , we understand that businesses have unique financial needs. That's why
              we offer{" "}
              <span className="font-bold text-white">tailored investment solutions</span>{" "}
              designed to fit your specific goals, whether you're looking for scalable
              growth, enhanced cash flow, or strategic financial planning
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="mt-10 sm:mt-12"
            >
              <Button
                as="a"
                href="/contact"
                className="bg-[#10B981] px-8 py-4 text-lg font-semibold text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:bg-[#059669] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)]"
              >
                Contact Us
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
