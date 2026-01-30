/**
 * Maps Firebase Auth error codes to user-friendly messages.
 * Covers all common auth errors so none are left unhandled.
 */
const FIREBASE_AUTH_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "This email is already registered. Sign in or use a different email.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/operation-not-allowed": "Sign-in method is not enabled. Contact support.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Invalid email or password. Please try again.",
  "auth/invalid-login-credentials": "Invalid email or password. Please try again.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed":
    "Network error. Check your connection and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/cancelled-popup-request": "Sign-in was cancelled.",
  "auth/requires-recent-login":
    "Please sign in again to complete this action.",
  "auth/expired-action-code": "This link has expired. Please request a new one.",
  "auth/invalid-action-code": "This link is invalid or has already been used.",
  "auth/credential-already-in-use": "This credential is already linked to another account.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email but different sign-in method.",
  "auth/argument-error": "Invalid request. Please check your input.",
  "auth/internal-error": "Something went wrong on our end. Please try again.",
};

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;
    if (typeof code === "string" && FIREBASE_AUTH_MESSAGES[code]) {
      return FIREBASE_AUTH_MESSAGES[code];
    }
    const message = (error as { message?: string }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return DEFAULT_MESSAGE;
}
