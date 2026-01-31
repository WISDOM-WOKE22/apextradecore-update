"use client";

import { motion } from "motion/react";
import { MembershipCard, type MembershipCardProps } from "./MembershipCard";
import { MEMBERSHIP_PLANS } from "./plans";

const HEADLINE = "Membership Card Investment Plans";
const SUBHEADING =
  "Sodales mauris quam faucibus scelerisque risus malesuada nulla. Cursus enim quis elementum feugiat ut.";

const VARIANTS: MembershipCardProps["variant"][] = [
  "light",
  "light",
  "premium",
  "gold",
];

export function MembershipPlansSection() {
  return (
    <section className="w-full bg-surface-alt">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:py-20 lg:px-10 lg:py-24">
        <header className="mx-auto max-w-[640px] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-[#212121]"
          >
            {HEADLINE}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {SUBHEADING}
          </motion.p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-6">
          {MEMBERSHIP_PLANS.map((plan, index) => (
            <MembershipCard
              key={plan.title}
              variant={VARIANTS[index]}
              {...plan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
