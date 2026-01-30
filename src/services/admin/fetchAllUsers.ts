"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { AdminUserSummary, UserRecord } from "./types";

export interface FetchAllUsersResult {
  users: AdminUserSummary[];
  error?: string;
}

export async function fetchAllUsers(): Promise<FetchAllUsersResult> {
  try {
    const snap = await get(ref(database, DB.users));
    const val = snap.val() as Record<string, UserRecord> | null;
    if (!val || typeof val !== "object") {
      return { users: [] };
    }
    const users: AdminUserSummary[] = [];
    for (const [uid, data] of Object.entries(val)) {
      const role = (data?.role ?? "user").toLowerCase();
      if (role === "admin") continue;
      users.push({
        uid,
        fullName: typeof data?.username === "string" ? data.username : "",
        email: typeof data?.email === "string" ? data.email : "",
        country: typeof data?.country === "string" ? data.country : "",
        phoneNumber: typeof data?.phoneNumber === "string" ? data.phoneNumber : "",
        date: typeof data?.date === "string" ? data.date : "",
        role,
      });
    }
    users.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return { users };
  } catch (err) {
    console.error("[fetchAllUsers]", err);
    return {
      users: [],
      error: err instanceof Error ? err.message : "Failed to load users",
    };
  }
}
