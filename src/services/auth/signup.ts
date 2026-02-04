"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { useState, useCallback } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { DB, formatDbDate } from "@/lib/realtime-db";

export type SignupResult = { success: true; idToken: string } | { success: false; error: string };

const RTDB_WRITE_TIMEOUT_MS = 15_000;

/** Run a promise with a timeout; reject with a clear error if it exceeds. */
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
}

export function useSignupService() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      country: string,
      phoneNumber: string,
      referralCode: string
    ): Promise<SignupResult> => {
      setError(null);
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get token first so auth is ready for Realtime Database
        const idToken = await user.getIdToken();

        // Payload: only strings so RTDB stores data reliably (matches existing DB shape)
        const userPayload: Record<string, string> = {
          userId: user.uid,
          username: fullName.trim(),
          email: email.trim(),
          password: password,
          country: country.trim(),
          phoneNumber: phoneNumber.trim(),
          date: formatDbDate(new Date()),
          role: "user",
        };
        if (referralCode.trim()) {
          userPayload.referralCode = referralCode.trim();
        }

        const userRef = ref(database, DB.user(user.uid));
        await withTimeout(
          set(userRef, userPayload),
          RTDB_WRITE_TIMEOUT_MS,
          "Saving your profile took too long. Check your connection and try again."
        );

        return { success: true, idToken };
      } catch (err: unknown) {
        const message = getAuthErrorMessage(err);
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { signUp, error, loading, clearError };
}
