"use client";

import { ref, push, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { NotificationType } from "./types";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

export type CreateNotificationResult =
  | { success: true; notificationId: string }
  | { success: false; error: string };

export async function createNotification(
  input: CreateNotificationInput
): Promise<CreateNotificationResult> {
  try {
    const notificationsRef = ref(database, DB.userNotifications(input.userId));
    const newRef = push(notificationsRef);
    const notificationId = newRef.key;
    if (!notificationId) return { success: false, error: "Failed to create notification" };

    const createdAt = Date.now();
    await set(newRef, {
      type: input.type,
      title: input.title,
      body: input.body,
      read: false,
      createdAt,
      ...(input.link ? { link: input.link } : {}),
    });

    return { success: true, notificationId };
  } catch (err) {
    console.error("[createNotification]", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create notification",
    };
  }
}
