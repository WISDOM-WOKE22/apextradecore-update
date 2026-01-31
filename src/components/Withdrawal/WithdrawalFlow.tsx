"use client";

import { motion, AnimatePresence } from "motion/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { createWithdrawal } from "@/services/withdrawals/createWithdrawal";

const CURRENCIES = [
  { id: "ETH", name: "Ethereum", symbol: "ETH" },
  { id: "BTC", name: "Bitcoin", symbol: "BTC" },
  { id: "USDT", name: "Tether", symbol: "USDT" },
  { id: "USDC", name: "USD Coin", symbol: "USDC" },
  { id: "SOL", name: "Solana", symbol: "SOL" },
  { id: "AVAX", name: "Avalanche", symbol: "AVAX" },
];

const STEPS = [
  { num: 1, label: "Select currency" },
  { num: 2, label: "Enter amount" },
  { num: 3, label: "Authorize withdrawal" },
];

function useWithdrawalParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const step = Math.min(3, Math.max(1, Number(searchParams.get("step")) || 1));
  const currency = searchParams.get("currency") || "";
  const amount = searchParams.get("amount") || "";

  const setParams = useCallback(
    (updates: { step?: number; currency?: string; amount?: string }) => {
      const next = new URLSearchParams(searchParams.toString());
      if (updates.step != null) next.set("step", String(updates.step));
      if (updates.currency !== undefined) {
        if (updates.currency) next.set("currency", updates.currency);
        else next.delete("currency");
      }
      if (updates.amount !== undefined) {
        if (updates.amount) next.set("amount", updates.amount);
        else next.delete("amount");
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { step, currency, amount, setParams };
}

function WithdrawalFlowInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { step, currency, amount, setParams } = useWithdrawalParams();
  const [amountInput, setAmountInput] = useState(amount);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (step === 2 && amount) setAmountInput(amount);
  }, [step, amount]);

  const goToStep = (s: number, extra?: { currency?: string; amount?: string }) => {
    const updates: { step: number; currency?: string; amount?: string } = { step: s };
    if (extra?.currency) updates.currency = extra.currency;
    if (extra?.amount) updates.amount = extra.amount;
    setParams(updates);
  };

  const handleAuthorizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!password.trim()) {
      setPasswordError("Please enter your password to authorize the withdrawal.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setPasswordError("You must be signed in to request a withdrawal.");
      return;
    }
    if (!currency || !amount || Number(amount) <= 0) {
      setPasswordError("Invalid amount or currency.");
      return;
    }
    setIsSubmitting(true);
    try {
      const walletType = CURRENCIES.find((c) => c.id === currency)?.name ?? currency;
      const result = await createWithdrawal({
        userId: user.uid,
        amount,
        withdrawalMode: currency,
        walletType,
        narration: "withdrawal",
      });
      if (result.success) {
        setShowSuccess(true);
      } else {
        setPasswordError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setAmountInput("");
    setPassword("");
    setPasswordError("");
    router.replace(pathname);
  };

  const baseInput =
    "w-full rounded-lg border px-4 py-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 transition-colors dark:text-[#f5f5f5] dark:placeholder:text-[#737373]";
  const inputStyles = passwordError
    ? `${baseInput} border-[#ef4444] bg-[#fef2f2] focus:border-[#ef4444] focus:ring-[#ef4444]/20 dark:border-[#f87171] dark:bg-[#450a0a]`
    : `${baseInput} border-[#e5e7eb] bg-[#f9fafb] focus:border-accent focus:bg-white focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:focus:border-accent dark:focus:bg-[#1a1a1a]`;

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">Withdraw funds</h1>
        <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">
          Choose your currency, amount, and authorize the withdrawal to your account.
        </p>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex gap-2 overflow-x-auto pb-2"
      >
        {STEPS.map((s) => (
          <div
            key={s.num}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              step >= s.num ? "bg-accent text-white" : "bg-[#f3f4f6] text-text-secondary dark:bg-[#262626] dark:text-[#a3a3a3]"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select currency */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
          >
            <h2 className="mb-4 text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Select cryptocurrency</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CURRENCIES.map((c) => (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => goToStep(2, { currency: c.id })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    currency === c.id
                      ? "border-accent bg-[#eef2ff] dark:bg-accent/20"
                      : "border-[#e5e7eb] bg-[#f9fafb] hover:border-accent/50 hover:bg-[#f9fafb] dark:border-[#2a2a2a] dark:bg-[#262626] dark:hover:border-accent/50 dark:hover:bg-[#262626]"
                  }`}
                >
                  <span className="block text-sm font-semibold text-[#111827] dark:text-[#f5f5f5]">{c.name}</span>
                  <span className="text-xs text-text-secondary dark:text-[#a3a3a3]">{c.symbol}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
          >
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <h2 className="mb-4 text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Enter amount</h2>
            <p className="mb-4 text-sm text-text-secondary dark:text-[#a3a3a3]">
              Currency: {CURRENCIES.find((c) => c.id === currency)?.name ?? currency}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = amountInput.trim();
                if (val && !Number.isNaN(Number(val)) && Number(val) > 0) goToStep(3, { amount: val });
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-lg text-[#111827] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent text-white"
                disabled={!amountInput.trim() || Number.isNaN(Number(amountInput)) || Number(amountInput) <= 0}
              >
                Continue
              </Button>
            </form>
          </motion.div>
        )}

        {/* Step 3: Authorize with password */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
          >
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <h2 className="mb-2 text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Authorize withdrawal</h2>
            <p className="mb-4 text-sm text-text-secondary dark:text-[#a3a3a3]">
              Confirm withdrawal of <strong className="text-[#111827] dark:text-[#f5f5f5]">{amount} {currency}</strong> to your account. Enter your password to authorize. This request will be sent to admin for approval.
            </p>

            <form onSubmit={handleAuthorizeSubmit} className="space-y-4">
              <div className="relative">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className={inputStyles}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
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
                {passwordError && (
                  <p className="mt-1.5 text-sm text-[#ef4444] dark:text-[#fca5a5]" role="alert">
                    {passwordError}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white disabled:opacity-70"
              >
                {isSubmitting ? "Submitting…" : "Authorize & submit for approval"}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeSuccess}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-xl dark:bg-[#1a1a1a]"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d1fae5] text-[#059669] dark:bg-[#064e3b] dark:text-[#34d399]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#111827] dark:text-[#f5f5f5]">Withdrawal submitted</h3>
                <p className="mb-6 text-sm text-text-secondary dark:text-[#a3a3a3]">
                  Your withdrawal request has been submitted successfully and is pending admin approval. You&apos;ll be notified once it&apos;s processed.
                </p>
                <Button type="button" onClick={closeSuccess} className="w-full bg-accent text-white">
                  Done
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WithdrawalFlow() {
  return (
    <Suspense fallback={<div className="mx-auto animate-pulse rounded-xl bg-[#f3f4f6] p-8 dark:bg-[#262626]" />}>
      <WithdrawalFlowInner />
    </Suspense>
  );
}
