"use client";

import { motion, AnimatePresence } from "motion/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { createDeposit } from "@/services/deposits/createDeposit";
import { useDepositWallets } from "@/services/wallets/useDepositWallets";

const STEPS = [
  { num: 1, label: "Select currency" },
  { num: 2, label: "Enter amount" },
  { num: 3, label: "Deposit address" },
  { num: 4, label: "Proof of payment" },
];

function useDepositParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const step = Math.min(5, Math.max(1, Number(searchParams.get("step")) || 1));
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

function DepositFlowInner() {
  const pathname = usePathname();
  const router = useRouter();
  const { step, currency, amount, setParams } = useDepositParams();
  const { wallets, loading: walletsLoading, error: walletsError } = useDepositWallets();
  const [amountInput, setAmountInput] = useState(amount);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const walletId = currency;
  const selectedWallet = walletId ? wallets.find((w) => w.id === walletId) : null;
  const amountDisplay = step === 2 && amount && !amountInput ? amount : amountInput;
  const walletAddress = selectedWallet?.address ?? "";
  const qrUrl = walletAddress
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(walletAddress)}`
    : "";

  const goToStep = (s: number, extra?: { currency?: string; amount?: string }) => {
    setSubmitError(null);
    const updates: { step: number; currency?: string; amount?: string } = { step: s };
    if (extra?.currency) updates.currency = extra.currency;
    if (extra?.amount) updates.amount = extra.amount;
    setParams(updates);
  };

  const handleCopy = async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet || !amount) return;
    const user = auth.currentUser;
    if (!user) {
      setSubmitError("You must be signed in to submit a deposit.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    const paymentMethod = selectedWallet.name;
    const result = await createDeposit({
      userId: user.uid,
      amount,
      paymentMethod,
      ...(proofFile ? { proofFile } : {}),
    });
    setIsSubmitting(false);
    if (result.success) {
      setShowSuccess(true);
    } else {
      setSubmitError(result.error);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setAmountInput("");
    setProofFile(null);
    setSubmitError(null);
    router.replace(pathname);
  };

  return (
    <div className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Deposit funds</h1>
        <p className="mt-1 text-sm text-text-secondary">Follow the steps to add funds to your account</p>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 flex gap-2 overflow-x-auto pb-2"
      >
        {STEPS.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
              step >= s.num ? "bg-accent text-white shadow-sm" : "bg-[#f3f4f6] text-text-secondary"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium">
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select wallet */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-[#111827]">Select deposit wallet</h2>
            {walletsLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                <p className="text-sm text-text-secondary">Loading options…</p>
              </div>
            ) : walletsError ? (
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                {walletsError}
              </div>
            ) : wallets.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-text-secondary">No deposit options available at the moment.</p>
                <p className="mt-1 text-sm text-text-secondary">Please try again later or contact support.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {wallets.map((w) => (
                  <motion.button
                    key={w.id}
                    type="button"
                    onClick={() => goToStep(2, { currency: w.id })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      walletId === w.id
                        ? "border-accent bg-[#eef2ff]"
                        : "border-[#e5e7eb] bg-[#f9fafb] hover:border-accent/50 hover:bg-[#f9fafb]"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-[#111827]">{w.name}</span>
                    <span className="mt-1 block truncate text-xs font-mono text-text-secondary" title={w.address}>
                      {w.address.slice(0, 12)}…
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
          >
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            {!selectedWallet ? (
              <div className="py-8 text-center">
                <p className="text-text-secondary">This wallet is no longer available.</p>
                <Button type="button" onClick={() => goToStep(1)} className="mt-4 bg-accent text-white">
                  Choose another wallet
                </Button>
              </div>
            ) : (
              <>
                <h2 className="mb-4 text-lg font-semibold text-[#111827]">Enter amount</h2>
                <p className="mb-4 text-sm text-text-secondary">Wallet: {selectedWallet.name}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = (amountInput || amount).trim();
                if (val && !Number.isNaN(Number(val))) goToStep(3, { amount: val });
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-[#374151]">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amountDisplay}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-white">
                Continue
              </Button>
            </form>
              </>
            )}
          </motion.div>
        )}

        {/* Step 3: Wallet address + QR */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
          >
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-[#111827]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            {!selectedWallet ? (
              <div className="py-8 text-center">
                <p className="text-text-secondary">This wallet is no longer available.</p>
                <Button type="button" onClick={() => goToStep(1)} className="mt-4 bg-accent text-white">
                  Choose another wallet
                </Button>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-lg font-semibold text-[#111827]">Deposit address</h2>
                <p className="mb-4 text-sm text-text-secondary">
                  Send exactly {amount} to this address for {selectedWallet.name}. Wrong address may result in loss.
                </p>

                <div className="mb-4 flex justify-center rounded-xl bg-[#f9fafb] p-4">
                  <img src={qrUrl} alt="QR code for wallet address" className="h-[220px] w-[220px] rounded-lg" />
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-xs font-medium text-text-secondary">Wallet address</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={walletAddress}
                      className="flex-1 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      onClick={handleCopy}
                      className="shrink-0 bg-[#111827] text-white hover:bg-[#374151]"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <Button type="button" onClick={() => goToStep(4)} className="w-full bg-accent text-white">
                  I&apos;ve sent the funds
                </Button>
              </>
            )}
          </motion.div>
        )}

        {/* Step 4: Proof of payment (optional) */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
          >
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-[#111827]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <h2 className="mb-2 text-lg font-semibold text-[#111827]">
              Proof of payment <span className="font-normal text-text-secondary">(optional)</span>
            </h2>
            <p className="mb-4 text-sm text-text-secondary">
              Add a screenshot or receipt to speed up verification. You can also submit without it.
            </p>

            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]"
                role="alert"
              >
                {submitError}
              </motion.div>
            )}

            <form onSubmit={handleProofSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="mb-2 block text-sm font-medium text-[#374151]">Upload file (optional)</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb] p-8 transition-all duration-200 hover:border-accent/60 hover:bg-[#eef2ff]/40">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      setProofFile(e.target.files?.[0] ?? null);
                      if (submitError) setSubmitError(null);
                    }}
                  />
                  {proofFile ? (
                    <span className="text-sm font-medium text-accent">{proofFile.name}</span>
                  ) : (
                    <>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2 text-text-secondary" aria-hidden>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-sm text-text-secondary">Click to upload or drag and drop</span>
                      <span className="mt-1 text-xs text-text-secondary">PNG, JPG, PDF up to 10MB</span>
                    </>
                  )}
                </label>
              </motion.div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white transition-opacity hover:opacity-95 disabled:opacity-70"
              >
                {isSubmitting ? "Submitting…" : proofFile ? "Submit with proof" : "Submit without proof"}
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
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={closeSuccess}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d1fae5]"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </motion.div>
                <h3 className="mb-2 text-xl font-bold text-[#111827]">Deposit submitted</h3>
                <p className="mb-6 text-sm text-text-secondary">
                  Your deposit is pending approval. You&apos;ll be notified once the admin verifies your payment.
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

export function DepositFlow() {
  return (
    <Suspense fallback={<div className="mx-auto animate-pulse rounded-xl bg-[#f3f4f6] p-8" />}>
      <DepositFlowInner />
    </Suspense>
  );
}
