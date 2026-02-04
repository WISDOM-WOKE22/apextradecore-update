"use client";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type UpdateUserSuspendedResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Set whether a user is suspended (blocked).
 * When true, the user will be signed out and cannot log in until unsuspended.
 */
export async function updateUserSuspended(
  uid: string,
  suspended: boolean
): Promise<UpdateUserSuspendedResult> {
  if (!uid.trim()) {
    return { success: false, error: "Invalid user." };
  }
  try {
    const userRef = ref(database, DB.user(uid));
    await update(userRef, { suspended });
    return { success: true };
  } catch (err) {
    console.error("[updateUserSuspended]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update suspension",
    };
  }
}
