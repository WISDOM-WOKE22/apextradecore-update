"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ContactItem } from "./ContactItem";
import contactImage from "@/assets/contact.webp"

const HEADLINE =
  "Have any questions? Don't hesitate to reach us.";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE;
const ADDRESS = process.env.NEXT_PUBLIC_CONTACT_ADDRESS;

const EnvelopeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export function ContactUs() {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-16 lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative h-[320px] w-full max-w-[420px] md:h-[600px]">
            <div
              className="absolute -left-12 -top-12 h-[150%] w-[140%] rounded-full bg-[#fce4ec] opacity-60 blur-[80px]"
              aria-hidden
            />
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={contactImage.src}
                alt="Customer service representative"
                fill
                // sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-center grayscale"
                priority={false}
              />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-tight tracking-tight text-[#212121]"
          >
            {HEADLINE}
          </motion.h2>
          <div className="flex flex-col gap-5">
            {EMAIL && <ContactItem icon={<EnvelopeIcon />} index={0}>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-inherit no-underline hover:text-accent"
                >
                  {EMAIL}
                </a>
              </ContactItem>}
           {PHONE && <ContactItem icon={<PhoneIcon />} index={1}>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="text-inherit no-underline hover:text-accent"
              >
                {PHONE}
              </a>
            </ContactItem>}
           {ADDRESS && <ContactItem icon={<LocationIcon />} index={2}>
              {ADDRESS}
            </ContactItem>}
          </div>
        </div>
      </div>
    </section>
  );
}
