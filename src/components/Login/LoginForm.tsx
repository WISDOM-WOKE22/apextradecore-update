"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
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

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Login successful! Welcome back.");
      // In a real app, you'd redirect here
      // router.push('/dashboard');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:p-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Sign in to your ApexTradeCore  Investment account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div className="relative">
          <FormField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-text-secondary hover:text-[#111827]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
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
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-[#e5e7eb] text-accent focus:ring-2 focus:ring-accent/20"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-accent no-underline hover:text-[#1552b8]"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-accent py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-accent no-underline hover:text-[#1552b8]"
          >
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
