"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useAllUsers } from "@/services/admin/useAllUsers";
import type { AdminUserSummary } from "@/services/admin/types";

const PAGE_SIZE = 10;

function filterUsers(users: AdminUserSummary[], query: string): AdminUserSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return users;
  return users.filter(
    (u) =>
      (u.fullName ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q)
  );
}

export default function AdminUsersPage() {
  const { users, loading, error, refetch } = useAllUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(
    () => filterUsers(users, searchQuery),
    [users, searchQuery]
  );
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pageIndex = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (pageIndex - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, pageIndex]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage((p) => Math.max(1, Math.min(totalPages, page)));
  }, [totalPages]);

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

      {!loading && users.length > 0 && (
        <div className="mb-4">
          <label htmlFor="admin-users-search" className="sr-only">
            Search users by name or email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              id="admin-users-search"
              type="search"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2.5 pl-10 pr-4 text-sm text-[#111827] placeholder:text-text-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:max-w-sm"
            />
          </div>
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
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-secondary">
            No users match &quot;{searchQuery}&quot;. Try a different search.
          </div>
        ) : (
          <>
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
                  {paginatedUsers.map((user) => (
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
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 sm:px-6">
                <p className="text-sm text-text-secondary">
                  Showing {(pageIndex - 1) * PAGE_SIZE + 1}–{Math.min(pageIndex * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToPage(pageIndex - 1)}
                    disabled={pageIndex <= 1}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - pageIndex) <= 1) return true;
                      return false;
                    })
                    .reduce<number[]>((acc, p, i, arr) => {
                      const prev = arr[i - 1];
                      if (prev !== undefined && p - prev > 1) acc.push(-1);
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p) =>
                      p === -1 ? (
                        <span key="ellipsis" className="px-1 text-text-secondary">…</span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => goToPage(p)}
                          className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            p === pageIndex
                              ? "bg-accent text-white"
                              : "border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f3f4f6]"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    type="button"
                    onClick={() => goToPage(pageIndex + 1)}
                    disabled={pageIndex >= totalPages}
                    className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f3f4f6] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
