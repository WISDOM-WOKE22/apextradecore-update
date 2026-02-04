"use client";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

/**
 * Saves or updates the user's password on their profile in Realtime Database at users/{uid}/password.
 * Same path as signup uses so the admin user details page can show it.
 */
export type SaveUserPasswordResult =
  | { success: true }
  | { success: false; error: string };

export async function saveUserPasswordToDb(
  uid: string,
  password: string
): Promise<SaveUserPasswordResult> {
  if (!uid || typeof password !== "string") {
    return { success: false, error: "Invalid user or password" };
  }
  try {
    const userRef = ref(database, DB.user(uid));
    await update(userRef, { password });
    return { success: true };
  } catch (err) {
    console.error("[saveUserPasswordToDb]", err);
    const message = err instanceof Error ? err.message : "Failed to save password to profile";
    return { success: false, error: message };
  }
}
