"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { Button } from "@/components/ui/Button";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  className = "",
  value,
  onChange,
  error,
}: FormFieldProps) {
  const baseInput =
    "w-full rounded-lg border px-4 py-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 transition-colors";
  const inputStyles = error
    ? `${baseInput} border-[#ef4444] bg-[#fef2f2] focus:border-[#ef4444] focus:ring-[#ef4444]/20`
    : `${baseInput} border-[#e5e7eb] bg-[#f9fafb] focus:border-accent focus:bg-white focus:ring-accent/20`;

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#374151]"
      >
        {label}
        {required && <span className="ml-1 text-[#ef4444]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={inputStyles}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsSubmitting(true);
    try {
      const resetUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined;
      await sendPasswordResetEmail(auth, email.trim(), resetUrl ? { url: resetUrl } : undefined);
      setIsSuccess(true);
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:p-8"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
            Check your email
          </h1>
          <p className="mb-6 text-base text-text-secondary">
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your inbox and follow the instructions to reset your password.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              as="a"
              href="/login"
              className="w-full sm:w-auto"
              variant="accent"
            >
              Back to sign in
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="w-full sm:w-auto"
              variant="primary"
            >
              Resend email
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:p-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
          Forgot password?
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          No worries! Enter your email address and we'll send you a link to reset
          your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          value={email}
          onChange={handleChange}
          error={error}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-accent py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent no-underline hover:text-[#1552b8]"
          >
            Sign in
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
