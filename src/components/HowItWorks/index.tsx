"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

const steps = [
  {
    title: "Select Your Membership Card",
    body: "Choose an investment plan that suits your financial goals.",
  },
  {
    title: "Confirm Your Investment",
    body: "Contact our support team or confirm your selection on our platform.",
  },
  {
    title: "Make Payment",
    body: "Securely process your payment to activate your membership.",
  },
  {
    title: "Start Earning",
    body: "Sit back and watch your investment grow. Returns are credited within 3 business days.",
  },
];

const logos = ["Snowflake", "Penta", "Vision", "Network"];

export function HowItWorks() {
  return (
    <section className="w-full bg-white">
      {/* Trusted by */}
      <div className="border-y border-pill-bg bg-[#fafafa]">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-6 px-6 py-10 text-center lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-base font-medium tracking-tight text-[#444444]"
          >
            Trusted by leading companies
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-base text-[#9b9b9b]"
          >
            {logos.map((logo) => (
              <span
                key={logo}
                className="font-semibold tracking-wide text-[#b0b0b0]"
              >
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-6"
        >
          <h2 className="text-[clamp(2rem,3.2vw,2.6rem)] font-bold tracking-tight text-[#111827]">
            How it works
          </h2>
          <p className="max-w-[540px] text-base leading-relaxed text-text-secondary">
            Our investment process is designed to be simple and hassle-free:
          </p>
          <ol className="space-y-4 text-base leading-relaxed text-[#444444]">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="mt-[2px] text-sm font-semibold text-[#999999]">
                  {index + 1}.
                </span>
                <p>
                  <span className="font-semibold">{step.title}</span>
                  <span> — {step.body}</span>
                </p>
              </li>
            ))}
          </ol>
          <Button as="a" href="#learn-more" className="mt-2 w-fit">
            Learn more
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          <div className="relative h-[260px] w-full max-w-[360px]">
            {/* Card stack */}
            <div className="absolute inset-0">
              <div className="absolute left-6 top-10 h-[160px] w-[280px] -rotate-6 rounded-3xl bg-linear-to-br from-[#0c1554] via-[#131b67] to-[#263da7] shadow-[0_24px_60px_rgba(5,10,40,0.6)]" />
              <div className="absolute left-3 top-24 h-[150px] w-[270px] rotate-0 rounded-3xl bg-linear-to-br from-[#3442d9] via-[#5865f2] to-[#9b8cff] opacity-90 shadow-[0_20px_50px_rgba(25,40,120,0.55)]" />
              <div className="absolute left-0 top-36 h-[140px] w-[260px] rotate-3 rounded-3xl bg-linear-to-br from-[#eef2ff] via-[#f9fbff] to-surface shadow-[0_18px_40px_rgba(15,23,42,0.18)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

