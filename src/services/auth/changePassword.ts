"use client";

import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useCallback } from "react";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { saveUserPasswordToDb } from "./saveUserPasswordToDb";

export type ChangePasswordResult =
  | { success: true }
  | { success: false; error: string };

export function useChangePassword() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string
    ): Promise<ChangePasswordResult> => {
      setError(null);
      setLoading(true);
      const user: User | null = auth.currentUser;
      if (!user || !user.email) {
        setError("You must be signed in to change your password.");
        setLoading(false);
        return { success: false, error: "You must be signed in to change your password." };
      }
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        const saveResult = await saveUserPasswordToDb(user.uid, newPassword);
        if (!saveResult.success) {
          setError(
            `Password was updated, but we couldn't save it to your profile. ${saveResult.error}`
          );
          return { success: false, error: saveResult.error };
        }
        return { success: true };
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

  const clearError = useCallback(() => setError(null), []);

  return { changePassword, error, loading, clearError };
}
