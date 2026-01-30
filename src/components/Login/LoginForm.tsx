"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLoginService } from "@/services/auth/login";

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
        autoComplete={name === "email" ? "email" : name === "password" ? "current-password" : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const SESSION_API = "/api/auth/session";

export function LoginForm() {
  const router = useRouter();
  const { login, error: authError, loading, clearError } = useLoginService();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authError) setSubmitError(authError);
  }, [authError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (submitError) {
      setSubmitError(null);
      clearError();
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
    setSubmitError(null);
    if (!validateForm()) return;

    const result = await login(formData.email.trim(), formData.password);
    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    try {
      const res = await fetch(SESSION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: result.idToken }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data?.error ?? "Failed to create session. Please try again.");
        return;
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const isSubmitting = loading;

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
          Sign in to your ApexTradeCore Investment account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {submitError && (
          <div
            className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
            role="alert"
          >
            {submitError}
          </div>
        )}

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          Don&apos;t have an account?{" "}
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
