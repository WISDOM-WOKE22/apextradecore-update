"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

const WELCOME = `Welcome to ${process.env.NEXT_PUBLIC_PROJECT_NAME} Investments`;
const HEADLINE =
  "Get a clear path to your financial freedom";
const DESCRIPTION =
  `At ${process.env.NEXT_PUBLIC_PROJECT_NAME} Investments, we provide exclusive investment opportunities with guaranteed returns. Whether you're a seasoned investor or new to the world of finance, we offer a range of flexible membership plans to suit your needs. With ${process.env.NEXT_PUBLIC_PROJECT_NAME}, your investment will work hard for you, bringing substantial returns in a short period of time.`;

export function HeroContent() {
  return (
    <div className="flex max-w-[600px] flex-col">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-4 inline-block w-fit rounded-full bg-[#f0f0f0] px-5 py-2.5 text-base text-[#666666]"
      >
        {WELCOME}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
        className="mb-6 text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.12] tracking-tight text-[#212121]"
      >
        {HEADLINE}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-8 max-w-[85%] text-lg leading-relaxed text-[#666666]"
      >
        {DESCRIPTION}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex flex-col gap-3 sm:flex-row sm:gap-4"
      >
        <Button as="a" href="/register">
          Sign Up
        </Button>
        <Button as="a" href="/invest-now">
          Invest Now
        </Button>
      </motion.div>
    </div>
  );
}
