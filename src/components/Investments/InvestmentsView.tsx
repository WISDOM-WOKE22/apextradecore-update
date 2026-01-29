"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";

const MOCK_BALANCE = 54321;

const PLANS = [
  {
    id: "deluxe",
    name: "Deluxe",
    minAmount: 13400,
    description: "400% return in 3 business days. Tailored financial advice and high security.",
    color: "from-[#6366f1] to-[#8b5cf6]",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "standard",
    name: "Standard",
    minAmount: 22999,
    description: "400% return in 3 business days. Dedicated support and priority processing.",
    color: "from-[#64748b] to-[#94a3b8]",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
  {
    id: "premium",
    name: "Premium",
    minAmount: 30700,
    description: "400% return in 3 business days. Premium support and custom plans.",
    color: "from-[#059669] to-[#10b981]",
    badge: "Best Value",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "gold",
    name: "Gold",
    minAmount: 48400,
    description: "400% return in 3 business days. VIP support and complimentary Tesla Model 3.",
    color: "from-[#b45309] to-[#f59e0b]",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

type SelectedPlan = (typeof PLANS)[number] | null;

export function InvestmentsView() {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>(null);
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const openPlan = useCallback((plan: (typeof PLANS)[number]) => {
    setSelectedPlan(plan);
    setAmountInput(String(plan.minAmount));
    setAmountError("");
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPlan(null);
    setAmountInput("");
    setAmountError("");
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedPlan) return;
    const num = Number(amountInput.replace(/,/g, ""));
    if (Number.isNaN(num) || num < selectedPlan.minAmount) {
      setAmountError(
        `Minimum deposit is $${selectedPlan.minAmount.toLocaleString()}. Make a deposit to add funds.`
      );
      return;
    }
    if (num > MOCK_BALANCE) {
      setAmountError(
        `Your balance is $${MOCK_BALANCE.toLocaleString()}. Make a deposit to add funds.`
      );
      return;
    }
    setAmountError("");
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setSelectedPlan(null);
      setAmountInput("");
    }, 600);
  }, [selectedPlan, amountInput]);

  const closeSuccess = useCallback(() => setShowSuccess(false), []);

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* Header + balance */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
          Available investments
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Choose a plan and deposit the required amount to start. If your balance is insufficient, you&apos;ll be guided to make a deposit.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2ff] text-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Your balance</p>
              <p className="text-xl font-bold text-[#111827] sm:text-2xl">
                ${MOCK_BALANCE.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan, i) => (
          <motion.article
            key={plan.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {plan.badge && (
              <span className="absolute right-3 top-3 rounded-full bg-[#059669] px-2.5 py-1 text-xs font-semibold text-white">
                {plan.badge}
              </span>
            )}
            <div
              className={`flex h-2 w-full bg-gradient-to-r ${plan.color}`}
              aria-hidden
            />
            <div className="flex flex-1 flex-col p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} text-white`}>
                {plan.icon}
              </div>
              <h2 className="text-lg font-bold text-[#111827]">{plan.name}</h2>
              <p className="mt-1 text-2xl font-bold text-[#111827]">
                ${plan.minAmount.toLocaleString()}
                <span className="text-sm font-normal text-text-secondary"> min</span>
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                {plan.description}
              </p>
              <Button
                type="button"
                onClick={() => openPlan(plan)}
                className="mt-5 w-full bg-accent text-white"
              >
                Start investment
              </Button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Amount modal */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeModal}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="investment-modal-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 id="investment-modal-title" className="text-xl font-bold text-[#111827]">
                  {selectedPlan.name} — Deposit amount
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg p-1 text-text-secondary hover:bg-[#f3f4f6] hover:text-[#111827]"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-[#f9fafb] p-4">
                  <p className="text-sm text-text-secondary">Minimum deposit</p>
                  <p className="text-lg font-semibold text-[#111827]">
                    ${selectedPlan.minAmount.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-[#f9fafb] p-4">
                  <p className="text-sm text-text-secondary">Your balance</p>
                  <p className="text-lg font-semibold text-[#111827]">
                    ${MOCK_BALANCE.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label htmlFor="deposit-amount" className="mb-2 block text-sm font-medium text-[#374151]">
                    Amount to deposit
                  </label>
                  <input
                    id="deposit-amount"
                    type="text"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      setAmountError("");
                    }}
                    placeholder={String(selectedPlan.minAmount)}
                    className={`w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${
                      amountError
                        ? "border-[#ef4444] bg-[#fef2f2] focus:border-[#ef4444] focus:ring-[#ef4444]/20"
                        : "border-[#e5e7eb] bg-[#f9fafb] focus:border-accent focus:ring-accent/20"
                    }`}
                  />
                  {amountError && (
                    <p className="mt-2 text-sm text-[#ef4444]" role="alert">
                      {amountError}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {amountError && (
                  <Button
                    as="a"
                    href="/deposit"
                    className="w-full border-2 border-accent bg-white text-accent hover:bg-[#eef2ff]"
                  >
                    Make deposit
                  </Button>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-sm font-medium text-text-secondary hover:text-[#111827]"
                  >
                    Cancel
                  </button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white disabled:opacity-70 sm:w-auto"
                  >
                    {isSubmitting ? "Starting…" : "Confirm & start"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
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
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d1fae5]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#111827]">Investment started</h3>
                <p className="mb-6 text-sm text-text-secondary">
                  Your investment has been started successfully. Track progress in My Investments.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button as="a" href="/my-investments" className="bg-accent text-white">
                    View my investments
                  </Button>
                  <Button
                    type="button"
                    onClick={closeSuccess}
                    className="border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
