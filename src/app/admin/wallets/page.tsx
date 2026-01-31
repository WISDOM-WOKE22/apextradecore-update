"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWallets } from "@/services/wallets/useWallets";
import type { Wallet } from "@/services/wallets/types";

function truncate(str: string, len: number): string {
  if (!str) return "—";
  if (str.length <= len) return str;
  return `${str.slice(0, len)}…`;
}

function StatusPill({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        enabled ? "bg-[#d1fae5] text-[#059669]" : "bg-[#f3f4f6] text-[#6b7280]"
      }`}
    >
      {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}

export default function AdminWalletsPage() {
  const {
    wallets,
    loading,
    error,
    refetch,
    addWallet,
    updateWalletEnabled,
    updateWalletName,
    updateWalletAddress,
    updateWalletNetworkChain,
    removeWallet,
  } = useWallets();

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addNetworkChain, setAddNetworkChain] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editNetworkChain, setEditNetworkChain] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [toggleSubmittingId, setToggleSubmittingId] = useState<string | null>(null);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSubmitting(true);
    const result = await addWallet(addName, addAddress, addNetworkChain || undefined);
    setAddSubmitting(false);
    if (result.success) {
      setShowAdd(false);
      setAddName("");
      setAddAddress("");
      setAddNetworkChain("");
    } else {
      setAddError(result.error ?? "Failed to add wallet");
    }
  };

  const startEdit = (w: Wallet) => {
    setEditingId(w.id);
    setEditName(w.name);
    setEditAddress(w.address);
    setEditNetworkChain(w.networkChain ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditAddress("");
    setEditNetworkChain("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setEditSubmitting(true);
    const [nameRes, addressRes, networkRes] = await Promise.all([
      updateWalletName(editingId, editName),
      updateWalletAddress(editingId, editAddress),
      updateWalletNetworkChain(editingId, editNetworkChain),
    ]);
    setEditSubmitting(false);
    if (nameRes.success && addressRes.success && networkRes.success) {
      cancelEdit();
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteSubmitting(true);
    const result = await removeWallet(id);
    setDeleteSubmitting(false);
    if (result.success) setDeleteConfirmId(null);
  };

  const handleToggle = async (w: Wallet) => {
    setToggleSubmittingId(w.id);
    await updateWalletEnabled(w.id, !w.enabled);
    setToggleSubmittingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Deposit wallets</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Add deposit wallets and set the network/chain so users know exactly which network to use. Only enabled wallets appear on the deposit page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb] disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAdd(true);
              setAddError(null);
              setAddName("");
              setAddAddress("");
              setAddNetworkChain("");
            }}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-95"
          >
            Add wallet
          </button>
        </div>
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
            <p className="text-sm text-text-secondary">Loading wallets…</p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-secondary">No wallets yet.</p>
            <p className="mt-1 text-sm text-text-secondary">Add a wallet to show it on the user deposit page.</p>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-95"
            >
              Add wallet
            </button>
          </div>
        ) : (
          <div className="table-scroll-wrap -mx-2 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Network / chain</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Address</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Status</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary sm:px-4 sm:py-3.5 lg:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {wallets.map((w) => (
                  <tr key={w.id} className="transition-colors hover:bg-[#fafafa]">
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      {editingId === w.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full min-w-0 max-w-[160px] rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="Wallet name"
                        />
                      ) : (
                        <span className="font-medium text-[#111827]">{w.name || "—"}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      {editingId === w.id ? (
                        <input
                          type="text"
                          value={editNetworkChain}
                          onChange={(e) => setEditNetworkChain(e.target.value)}
                          className="w-full min-w-0 max-w-[180px] rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="e.g. ERC-20, TRC-20"
                        />
                      ) : (
                        <span className="text-sm text-text-secondary">
                          {w.networkChain || "—"}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      {editingId === w.id ? (
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full min-w-0 max-w-[240px] rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="Address"
                        />
                      ) : (
                        <span className="font-mono text-sm text-text-secondary">
                          {truncate(w.address, 18)}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5 lg:px-6">
                      <StatusPill enabled={w.enabled} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right sm:px-4 sm:py-3.5 lg:px-6">
                      {editingId === w.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleEditSubmit}
                            disabled={editSubmitting}
                            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                          >
                            {editSubmitting ? "Saving…" : "Save"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(w)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-accent hover:bg-[#eef2ff]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggle(w)}
                            disabled={toggleSubmittingId === w.id}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] disabled:opacity-60"
                          >
                            {toggleSubmittingId === w.id
                              ? "…"
                              : w.enabled
                                ? "Disable"
                                : "Enable"}
                          </button>
                          {deleteConfirmId === w.id ? (
                            <span className="flex items-center gap-2">
                              <span className="text-xs text-[#6b7280]">Delete?</span>
                              <button
                                type="button"
                                onClick={() => handleDelete(w.id)}
                                disabled={deleteSubmitting}
                                className="rounded-lg bg-[#dc2626] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#b91c1c] disabled:opacity-60"
                              >
                                {deleteSubmitting ? "…" : "Yes"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f3f4f6]"
                              >
                                No
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(w.id)}
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add wallet modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => !addSubmitting && setShowAdd(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold text-[#111827]">Add wallet</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Add a deposit wallet. Set the network/chain so users know exactly which network to use.
              </p>
              {addError && (
                <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                  {addError}
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="add-name" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Name
                  </label>
                  <input
                    id="add-name"
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. USDT, Bitcoin (BTC)"
                    required
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label htmlFor="add-network" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Network / chain
                  </label>
                  <input
                    id="add-network"
                    type="text"
                    value={addNetworkChain}
                    onChange={(e) => setAddNetworkChain(e.target.value)}
                    placeholder="e.g. Ethereum (ERC-20), Bitcoin, TRC-20"
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  <p className="mt-1 text-xs text-text-secondary">
                    Shown to users so they send funds on the correct network.
                  </p>
                </div>
                <div>
                  <label htmlFor="add-address" className="mb-1.5 block text-sm font-medium text-[#374151]">
                    Address
                  </label>
                  <input
                    id="add-address"
                    type="text"
                    value={addAddress}
                    onChange={(e) => setAddAddress(e.target.value)}
                    placeholder="Wallet address or contract"
                    required
                    className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 font-mono text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !addSubmitting && setShowAdd(false)}
                    disabled={addSubmitting}
                    className="flex-1 rounded-lg border border-[#e5e7eb] bg-white py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addSubmitting}
                    className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                  >
                    {addSubmitting ? "Adding…" : "Add wallet"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
