"use client";

import {
  checkActionCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth as authInstance } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { saveUserPasswordToDb } from "./saveUserPasswordToDb";

export type ResetPasswordResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Resets the user's password using Firebase email link (oobCode), then saves
 * the new password to Realtime Database so it stays in sync.
 */
export async function resetPassword(
  oobCode: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  if (!oobCode.trim()) {
    return { success: false, error: "Reset link is invalid or expired." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }
  try {
    const actionCodeInfo = await checkActionCode(authInstance, oobCode);
    const email = actionCodeInfo.data?.email;
    if (!email) {
      return { success: false, error: "Reset link is invalid or expired." };
    }

    await confirmPasswordReset(authInstance, oobCode, newPassword);

    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email,
      newPassword
    );
    const saveResult = await saveUserPasswordToDb(userCredential.user.uid, newPassword);
    await authInstance.signOut();

    if (!saveResult.success) {
      return {
        success: false,
        error: saveResult.error ?? "Password was reset but could not be saved to profile.",
      };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = getAuthErrorMessage(err);
    return { success: false, error: message };
  }
}
