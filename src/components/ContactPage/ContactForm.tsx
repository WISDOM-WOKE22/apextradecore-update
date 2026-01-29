"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  rows,
  className = "",
}: FormFieldProps) {
  const baseInput =
    "w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors";

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#374151]"
      >
        {label}
        {required && <span className="ml-1 text-[#ef4444]">*</span>}
      </label>
      {rows ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className={`${baseInput} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={baseInput}
        />
      )}
    </div>
  );
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for your message! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:p-8"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Name"
            name="name"
            placeholder="Your Name"
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Work Email"
            required
          />
        </div>

        <FormField
          label="Company"
          name="company"
          placeholder="Company Name"
        />

        <FormField
          label="Message"
          name="message"
          placeholder="Your Message"
          rows={6}
          required
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`mt-2 w-full rounded-lg bg-accent px-6 py-4 text-base font-semibold text-white transition-colors duration-200 ${
            isSubmitting
              ? "cursor-not-allowed opacity-70"
              : "hover:bg-[#1552b8] focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2"
          }`}
          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
        >
          {isSubmitting ? "Sending..." : "Contact us"}
        </motion.button>
      </form>
    </motion.div>
  );
}
