"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useCallback } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export type LoginResult =
  | { success: true; idToken: string }
  | { success: false; error: string };

export function useLoginService() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return { success: true, idToken };
    } catch (err: unknown) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, error, loading, clearError };
}
