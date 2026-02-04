"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { motion } from "motion/react";
import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SESSION_API = "/api/auth/session";

export default function AccountBlockedPage() {
  const reset = useAppStore((s) => s.reset);
  const setSuspendedMessage = useAppStore((s) => s.setSuspendedMessage);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLogoutError(null);
    setLoggingOut(true);
    try {
      await fetch(SESSION_API, { method: "DELETE", credentials: "include" });
    } catch {
      // Continue to clear client state even if API fails
    }
    try {
      await signOut(auth);
      reset();
      setSuspendedMessage(null);
      // Full navigation so login page loads with a clean session
      window.location.replace("/login");
    } catch (err) {
      setLogoutError(err instanceof Error ? err.message : "Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#f9fafb] via-white to-[#fef2f2] opacity-50" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, #b91c1c 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[calc(100vh-144px)] max-w-[1120px] items-center justify-center px-6 py-12 sm:py-16 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[520px] rounded-2xl border border-[#fecaca] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:border-[#7f1d1d] dark:bg-[#1a1a1a] sm:p-8"
          >
            <div className="flex justify-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fef2f2] dark:bg-[#7f1d1d]"
                aria-hidden
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[#b91c1c] dark:text-[#fca5a5]"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </span>
            </div>
            <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">
              Account blocked
            </h1>
            <p className="mt-3 text-center text-base text-[#374151] dark:text-[#a3a3a3]">
              Your account has been suspended. You do not have access to the platform at this time.
            </p>
            <div className="mt-6 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 dark:border-[#7f1d1d] dark:bg-[#7f1d1d]/20">
              <p className="text-center text-sm font-medium text-[#b91c1c] dark:text-[#fca5a5]">
                Please contact the administrator or company personnel to resolve this matter.
              </p>
            </div>
            {logoutError && (
              <p className="mt-4 text-center text-sm text-[#b91c1c] dark:text-[#fca5a5]" role="alert">
                {logoutError}
              </p>
            )}
            <div className="mt-8">
              <Button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full border border-[#e5e7eb] bg-white py-4 text-base font-semibold text-[#374151] hover:bg-[#f9fafb] disabled:opacity-70 dark:border-[#2a2a2a] dark:bg-[#262626] dark:text-[#f5f5f5] dark:hover:bg-[#404040]"
              >
                {loggingOut ? "Logging out…" : "Log out"}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
