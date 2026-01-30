"use client";

import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";

export type MarkNotificationReadResult =
  | { success: true }
  | { success: false; error: string };

export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<MarkNotificationReadResult> {
  try {
    const path = DB.userNotification(userId, notificationId);
    await update(ref(database, path), { read: true });
    return { success: true };
  } catch (err) {
    console.error("[markNotificationRead]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to mark as read",
    };
  }
}
