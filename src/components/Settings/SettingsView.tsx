"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useLogoutService } from "@/services/auth/logout";
import { useChangePassword } from "@/services/auth/changePassword";
import { updateUserProfile } from "@/services/user/updateUserProfile";

const baseInput =
  "w-full rounded-lg border px-4 py-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 transition-colors dark:text-[#f5f5f5] dark:placeholder:text-[#737373]";
const inputStyles = (error: boolean) =>
  error
    ? `${baseInput} border-[#ef4444] bg-[#fef2f2] focus:border-[#ef4444] focus:ring-[#ef4444]/20 dark:border-[#f87171] dark:bg-[#450a0a] dark:focus:bg-[#450a0a]`
    : `${baseInput} border-[#e5e7eb] bg-[#f9fafb] focus:border-accent focus:bg-white focus:ring-accent/20 dark:border-[#2a2a2a] dark:bg-[#262626] dark:focus:border-accent dark:focus:bg-[#1a1a1a]`;

export interface SettingsViewProps {
  title?: string;
  subtitle?: string;
}

export function SettingsView({
  title = "Settings",
  subtitle = "Manage your account and preferences",
}: SettingsViewProps) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const reset = useAppStore((s) => s.reset);

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const { changePassword, loading: passwordLoading, error: passwordAuthError, clearError: clearPasswordError } = useChangePassword();
  const { logout, loading: logoutLoading } = useLogoutService();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setCountry(user.country || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);
    const trimmed = fullName.trim();
    if (!trimmed) {
      setProfileError("Full name is required");
      return;
    }
    if (!user?.uid) {
      setProfileError("You must be signed in to update your profile.");
      return;
    }
    setProfileLoading(true);
    const result = await updateUserProfile(user.uid, {
      fullName: trimmed,
      country: country.trim() || undefined,
      phoneNumber: phoneNumber.trim() || undefined,
    });
    setProfileLoading(false);
    if (result.success) {
      setUser({
        ...user,
        fullName: trimmed,
        country: country.trim() || user.country,
        phoneNumber: phoneNumber.trim() || user.phoneNumber,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } else {
      setProfileError(result.error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearPasswordError();
    setPasswordErrors({});
    setPasswordSuccess(false);
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    else if (newPassword.length < 6) errors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      reset();
      router.push("/login");
      router.refresh();
    }
  };

  if (!user) {
    return (
      <div className="mx-auto w-full rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
        <p className="text-text-secondary dark:text-[#a3a3a3]">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f5f5f5] sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-text-secondary dark:text-[#a3a3a3]">{subtitle}</p>
      </motion.div>

      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-6 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-accent dark:bg-accent/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Profile</h2>
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Update your display name and contact info</p>
          </div>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setProfileError("");
              }}
              placeholder="Your full name"
              className={inputStyles(!!profileError)}
            />
          </div>
          <div>
            <label htmlFor="country" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. United States"
              className={inputStyles(false)}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
              Phone number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +1 234 567 8900"
              className={inputStyles(false)}
            />
          </div>
          {profileError && (
            <p className="text-sm text-[#ef4444] dark:text-[#fca5a5]" role="alert">{profileError}</p>
          )}
          <Button
            type="submit"
            disabled={profileLoading}
            className="bg-accent text-white hover:bg-[#1552b8] disabled:opacity-70"
          >
            {profileLoading ? "Saving…" : profileSaved ? "✓ Saved" : "Save profile"}
          </Button>
        </form>
      </motion.section>

      {/* Password */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a] sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-accent dark:bg-accent/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Password</h2>
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Change your password</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
              Current password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordErrors((p) => ({ ...p, currentPassword: "" }));
                }}
                placeholder="Enter current password"
                className={inputStyles(!!passwordErrors.currentPassword)}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-[#111827] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
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
              <p className="mt-1.5 text-sm text-[#ef4444] dark:text-[#fca5a5]" role="alert">{passwordErrors.currentPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
              New password
            </label>
            <input
              id="newPassword"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErrors((p) => ({ ...p, newPassword: "" }));
              }}
              placeholder="Enter new password"
              className={inputStyles(!!passwordErrors.newPassword)}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1.5 text-sm text-[#ef4444] dark:text-[#fca5a5]" role="alert">{passwordErrors.newPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordErrors((p) => ({ ...p, confirmPassword: "" }));
              }}
              placeholder="Confirm new password"
              className={inputStyles(!!passwordErrors.confirmPassword)}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1.5 text-sm text-[#ef4444] dark:text-[#fca5a5]" role="alert">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          {(passwordAuthError || passwordSuccess) && (
            <p className={`text-sm ${passwordSuccess ? "text-[#059669] dark:text-[#34d399]" : "text-[#ef4444] dark:text-[#fca5a5]"}`} role="alert">
              {passwordSuccess ? "✓ Password updated successfully." : passwordAuthError}
            </p>
          )}
          <Button
            type="submit"
            disabled={passwordLoading}
            className="bg-accent text-white hover:bg-[#1552b8] disabled:opacity-70"
          >
            {passwordLoading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </motion.section>

      {/* Account info (read-only) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="mb-6 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-5 dark:border-[#2a2a2a] dark:bg-[#262626] sm:p-6"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e5e7eb] text-[#6b7280] dark:bg-[#404040] dark:text-[#a3a3a3]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Account</h2>
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">Your sign-in email (cannot be changed here)</p>
          </div>
        </div>
        <p className="text-sm font-medium text-[#374151] dark:text-[#e5e5e5]">{user.email}</p>
      </motion.section>

      {/* Sign out */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-5 dark:border-[#7f1d1d] dark:bg-[#450a0a] sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fee2e2] text-[#dc2626] dark:bg-[#7f1d1d] dark:text-[#fca5a5]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827] dark:text-[#f5f5f5]">Sign out</h2>
            <p className="text-sm text-text-secondary dark:text-[#a3a3a3]">End your session on this device</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="border border-[#f87171] bg-[#ef4444] text-white hover:bg-[#dc2626] disabled:opacity-70 dark:border-[#b91c1c] dark:bg-[#dc2626] dark:hover:bg-[#b91c1c]"
        >
          {logoutLoading ? "Signing out…" : "Log out"}
        </Button>
      </motion.section>
    </div>
  );
}
