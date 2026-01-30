"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useAllUsers } from "@/services/admin/useAllUsers";

export default function AdminUsersPage() {
  const { users, loading, error, refetch } = useAllUsers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all registered users. Admins are excluded from this list.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="self-start rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading users…</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            No users found. Only non-admin users are shown.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">
                    Name
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">
                    Email
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">
                    Country
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">
                    Joined
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {users.map((user) => (
                  <tr
                    key={user.uid}
                    className="transition-colors hover:bg-[#f9fafb]"
                  >
                    <td className="px-4 py-3.5 sm:px-6">
                      <span className="font-medium text-[#111827]">
                        {user.fullName || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">
                      {user.email || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">
                      {user.country || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-secondary sm:px-6">
                      {user.date || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-6">
                      <Link
                        href={`/admin/users/${encodeURIComponent(user.uid)}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-[#1552b8]"
                      >
                        View details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
