"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const baseInput =
  "w-full rounded-lg border px-4 py-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 transition-colors";
const inputStyles = (error: boolean) =>
  error
    ? `${baseInput} border-[#ef4444] bg-[#fef2f2] focus:border-[#ef4444] focus:ring-[#ef4444]/20`
    : `${baseInput} border-[#e5e7eb] bg-[#f9fafb] focus:border-accent focus:bg-white focus:ring-accent/20`;

export function SettingsView() {
  const [fullName, setFullName] = useState("Ryan Crawford");
  const [nameError, setNameError] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    if (!trimmed) {
      setNameError("Full name is required");
      return;
    }
    setNameError("");
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    else if (newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="mx-auto">
      {/* <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your account and preferences</p>
      </motion.div> */}

      {/* Profile – Full name */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -1 }}
        className="mb-6 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef2ff] text-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Profile</h2>
            <p className="text-sm text-text-secondary">Update your display name</p>
          </div>
        </div>
        <form onSubmit={handleSaveName} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#374151]">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setNameError("");
              }}
              placeholder="Your full name"
              className={inputStyles(!!nameError)}
            />
            {nameError && (
              <p className="mt-1.5 text-sm text-[#ef4444]" role="alert">{nameError}</p>
            )}
          </div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="bg-accent text-white hover:bg-[#1552b8]">
              {nameSaved ? "✓ Saved" : "Save name"}
            </Button>
          </motion.div>
        </form>
      </motion.section>

      {/* Password change */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -1 }}
        className="mb-6 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef2ff] text-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Password</h2>
            <p className="text-sm text-text-secondary">Change your password</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-[#374151]">
              Current password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={inputStyles(!!passwordErrors.currentPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-[#111827]"
                aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
              >
                {showPasswords ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-1.5 text-sm text-[#ef4444]" role="alert">{passwordErrors.currentPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-[#374151]">
              New password
            </label>
            <input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={inputStyles(!!passwordErrors.newPassword)}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1.5 text-sm text-[#ef4444]" role="alert">{passwordErrors.newPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#374151]">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={inputStyles(!!passwordErrors.confirmPassword)}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1.5 text-sm text-[#ef4444]" role="alert">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="bg-accent text-white hover:bg-[#1552b8]">
              {passwordSaved ? "✓ Password updated" : "Update password"}
            </Button>
          </motion.div>
        </form>
      </motion.section>

      {/* Logout */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fee2e2] text-[#dc2626]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Sign out</h2>
            <p className="text-sm text-text-secondary">End your session on this device</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-[#f87171] bg-[#ef4444] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#dc2626]"
          >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
