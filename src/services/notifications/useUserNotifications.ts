"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchUserNotifications } from "./fetchUserNotifications";
import { markNotificationRead } from "./markNotificationRead";
import type { Notification } from "./types";

export interface UseUserNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export function useUserNotifications(userId: string | null): UseUserNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await fetchUserNotifications(userId);
    setNotifications(result.notifications);
    if (result.error) setError(result.error);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!userId) return;
      const result = await markNotificationRead(userId, id);
      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    },
    [userId]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch,
    markAsRead,
  };
}
