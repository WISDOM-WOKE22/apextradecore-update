"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { Notification, NotificationRecord } from "./types";

export interface FetchUserNotificationsResult {
  notifications: Notification[];
  error?: string;
}

export async function fetchUserNotifications(
  userId: string
): Promise<FetchUserNotificationsResult> {
  try {
    const snap = await get(ref(database, DB.userNotifications(userId)));
    const val = snap.val() as Record<string, NotificationRecord> | null;
    if (!val || typeof val !== "object") {
      return { notifications: [] };
    }

    const notifications: Notification[] = [];
    for (const [id, data] of Object.entries(val)) {
      if (!data || typeof data !== "object") continue;
      notifications.push({
        id,
        type: data.type,
        title: typeof data.title === "string" ? data.title : "",
        body: typeof data.body === "string" ? data.body : "",
        read: data.read === true,
        createdAt: typeof data.createdAt === "number" ? data.createdAt : 0,
        link: typeof data.link === "string" ? data.link : undefined,
      });
    }

    notifications.sort((a, b) => b.createdAt - a.createdAt);
    return { notifications };
  } catch (err) {
    console.error("[fetchUserNotifications]", err);
    return {
      notifications: [],
      error: err instanceof Error ? err.message : "Failed to load notifications",
    };
  }
}
