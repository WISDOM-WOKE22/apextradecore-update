"use client";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export interface UpdateProfileInput {
  fullName: string;
  country?: string;
  phoneNumber?: string;
}

export type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function updateUserProfile(
  uid: string,
  input: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const updates: Record<string, string> = {
      username: input.fullName.trim(),
    };
    if (input.country !== undefined) updates.country = input.country.trim();
    if (input.phoneNumber !== undefined) updates.phoneNumber = input.phoneNumber.trim();
    await update(ref(database, DB.user(uid)), updates);
    return { success: true };
  } catch (err) {
    console.error("[updateUserProfile]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update profile",
    };
  }
}
