"use client";

import { get, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { DB } from "@/lib/realtime-db";
import type { AdminUserSummary, UserRecord } from "./types";

/** Parse DB date string "d-m-yyyy" to milliseconds for sorting. Returns 0 if invalid. */
function parseDbDateToMs(dateStr: string): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const parts = dateStr.trim().split("-").map(Number);
  if (parts.length !== 3) return 0;
  const [d, m, y] = parts;
  if (!y || !m || !d) return 0;
  const t = new Date(y, m - 1, d).getTime();
  return Number.isFinite(t) ? t : 0;
}

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
    // Sort by creation date descending (newest first). Same date → stable order by uid.
    users.sort((a, b) => {
      const ta = parseDbDateToMs(a.date);
      const tb = parseDbDateToMs(b.date);
      if (tb !== ta) return tb - ta;
      return (b.uid || "").localeCompare(a.uid || "");
    });
    return { users };
  } catch (err) {
    console.error("[fetchAllUsers]", err);
    return {
      users: [],
      error: err instanceof Error ? err.message : "Failed to load users",
    };
  }
}
