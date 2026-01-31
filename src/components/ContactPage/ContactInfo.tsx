"use client";

import { motion } from "motion/react";

const LABEL = "Contact";
const HEADLINE = "Don't hesitate to reach out to us";
const DESCRIPTION =
  "Our team is always available to assist you with any inquiries or investment needs. Contact us today and take the first step toward financial growth!";

const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE;
const ADDRESS = process.env.NEXT_PUBLIC_CONTACT_ADDRESS;

const EnvelopeIcon = () => (
  <svg
    width="20"
    height="20"
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
    width="20"
    height="20"
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
    width="20"
    height="20"
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

interface ContactDetailProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  index?: number;
}

function ContactDetail({ icon, children, index = 0 }: ContactDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, delay: 0.1 * index, ease: "easeOut" }}
      className="flex items-start gap-4"
    >
      <span
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white"
        aria-hidden
      >
        {icon}
      </span>
      <span className="pt-1.5 text-base leading-relaxed text-[#374151] sm:text-lg">
        {children}
      </span>
    </motion.div>
  );
}

export function ContactInfo() {
  return (
    <div className="flex flex-col">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-3 text-base font-semibold uppercase tracking-wider text-[#3b82f6] sm:text-lg"
      >
        {LABEL}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        className="mb-5 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-[#111827] sm:mb-6"
      >
        {HEADLINE}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="mb-10 text-base leading-relaxed text-text-secondary sm:mb-12 sm:text-lg"
      >
        {DESCRIPTION}
      </motion.p>

      <div className="flex flex-col gap-6">
       {EMAIL && <ContactDetail icon={<EnvelopeIcon />} index={0}>
          <a
            href={`mailto:${EMAIL}`}
            className="text-inherit no-underline hover:text-accent"
          >
            {EMAIL}
          </a>
        </ContactDetail>}
        {PHONE && <ContactDetail icon={<PhoneIcon />} index={1}>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="text-inherit no-underline hover:text-accent"
          >
            {PHONE}
          </a>
        </ContactDetail>}
       {ADDRESS && <ContactDetail icon={<LocationIcon />} index={2}>
            {ADDRESS}
          </ContactDetail>}
      </div>
    </div>
  );
}
