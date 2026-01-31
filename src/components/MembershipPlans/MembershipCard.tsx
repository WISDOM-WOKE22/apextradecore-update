"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "./CheckIcon";

export type CardVariant = "light" | "premium" | "gold";

export interface MembershipCardProps {
  variant: CardVariant;
  title: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
}

const variantStyles = {
  light: {
    wrapper:
      "border border-[#e5e7eb] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
    title: "text-[#212121]",
    price: "text-[#212121]",
    priceCents: "text-[#212121]/80",
    description: "text-text-secondary",
    feature: "text-[#374151]",
    check: "text-[#374151]",
    button: "primary" as const,
  },
  premium: {
    wrapper:
      "border-0 bg-[#059669] shadow-[0_8px_32px_rgba(5,150,105,0.35)]",
    title: "text-white",
    price: "text-white",
    priceCents: "text-white/90",
    description: "text-white/95",
    feature: "text-white",
    check: "text-white",
    button: "primary" as const,
  },
  gold: {
    wrapper:
      "border-0 bg-[#1e293b] shadow-[0_8px_32px_rgba(15,23,42,0.4)]",
    title: "text-white",
    price: "text-white",
    priceCents: "text-white/90",
    description: "text-white/90",
    feature: "text-white",
    check: "text-white",
    button: "primary" as const,
  },
};

export function MembershipCard({
  variant,
  title,
  price,
  description,
  features,
  badge,
}: MembershipCardProps) {
  const styles = variantStyles[variant];
  const normalized = price.replace(/^\$/, "");
  const [dollars, cents] = normalized.includes(".") ? normalized.split(".") : [normalized, "00"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: variant === "light" ? -4 : 0 }}
      className={`flex flex-col rounded-2xl p-6 transition-shadow duration-300 sm:p-7 ${styles.wrapper} ${variant !== "light" ? "hover:shadow-lg" : "hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"}`}
    >
      {badge && (
        <span className="mb-3 inline-block w-fit rounded-full bg-[#047857] px-3 py-1 text-sm font-semibold text-white">
          {badge}
        </span>
      )}
      <h3
        className={`text-lg font-bold tracking-tight sm:text-xl ${styles.title}`}
      >
        {title}
      </h3>
      <div className="mt-3 flex items-baseline gap-0.5">
        <span className={`text-2xl font-bold tracking-tight sm:text-3xl ${styles.price}`}>
          ${dollars}
        </span>
        <span className={`text-lg font-bold ${styles.priceCents}`}>.{cents}</span>
      </div>
      <p className={`mt-3 text-sm leading-relaxed sm:text-base ${styles.description}`}>
        {description}
      </p>
      <ul className="mt-5 flex flex-col gap-2.5 sm:mt-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckIcon className={styles.check} />
            <span className={`text-sm leading-snug sm:text-base ${styles.feature}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6 sm:pt-8">
        <Button
          as="a"
          href="/register"
          className={
            variant === "premium"
              ? "w-full bg-white text-[#059669] hover:bg-white/95 hover:text-[#047857]"
              : variant === "gold"
                ? "w-full bg-white text-[#1e293b] hover:bg-white/95"
                : "w-full"
          }
          variant="primary"
        >
          Get started
        </Button>
      </div>
    </motion.article>
  );
}
