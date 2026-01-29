"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Austria",
  "Belgium",
  "Ireland",
  "Portugal",
  "Poland",
  "Japan",
  "South Korea",
  "Singapore",
  "Hong Kong",
  "New Zealand",
  "South Africa",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "India",
  "China",
  "Other",
];

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
      {name === "country" ? (
        <select
          id={name}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={inputStyles}
        >
          <option value="">Select your country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      ) : (
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
      )}
      {error && (
        <p className="mt-1.5 text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    referralCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.country) {
      newErrors.country = "Please select your country";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
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
      alert("Account created successfully! Welcome to ApexTradeCore  Investment.");
      // Reset form
      setFormData({
        fullName: "",
        country: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        referralCode: "",
      });
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
          Create your account
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Join ApexTradeCore  Investment and start your financial journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          required
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <FormField
          label="Country"
          name="country"
          placeholder="Select your country"
          required
          value={formData.country}
          onChange={handleChange}
          error={errors.country}
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

        <div className="relative">
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] text-text-secondary hover:text-[#111827]"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
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

        <FormField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          placeholder="+1 (555) 123-4567"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
        />

        <FormField
          label="Referral Code"
          name="referralCode"
          placeholder="Enter referral code (optional)"
          value={formData.referralCode}
          onChange={handleChange}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-accent py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{" "}
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
