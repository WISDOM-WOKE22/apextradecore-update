"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useCallback } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export type LogoutResult = { success: true } | { success: false; error: string };

const SESSION_API = "/api/auth/session";

export function useLogoutService() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const logout = useCallback(async (): Promise<LogoutResult> => {
    setError(null);
    setLoading(true);
    try {
      await fetch(SESSION_API, { method: "DELETE", credentials: "include" });
    } catch {
      // Proceed to clear client state even if API fails
    }
    try {
      await signOut(auth);
      return { success: true };
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, error, loading, clearError };
}
