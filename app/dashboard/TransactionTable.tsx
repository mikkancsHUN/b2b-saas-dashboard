"use client";

import { useState } from "react";
import RefreshButton from "./RefreshButton";

interface Transaction {
  id: string;
  client: string; // Maps to the 'client' column in the Supabase schema
  email: string;
  amount: string;
  status: "succeeded" | "pending" | "failed" | string; // Expected lowercase values from DB
  date: string;
}

interface TransactionTableProps {
  initialTransactions: Transaction[];
}

// Declarative mapping for dynamic status pill styling to keep JSX clear of rendering logic
const STATUS_CONFIG: Record<string, { badge: string; dot: string }> = {
  succeeded: {
    badge:
      "bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-[#4ADE80]",
    dot: "bg-emerald-500 dark:bg-[#4ADE80]",
  },
  pending: {
    badge:
      "bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-[#FACC15]",
    dot: "bg-amber-500 dark:bg-[#FACC15]",
  },
  failed: {
    badge:
      "bg-rose-500/10 dark:bg-rose-500/5 border-rose-500/20 text-rose-500 dark:text-[#FF3366]",
    dot: "bg-rose-500 dark:bg-[#FF3366]",
  },
};

export default function TransactionTable({
  initialTransactions,
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Client-side execution of search query and status grouping
  const filteredTransactions = initialTransactions.filter((tx) => {
    const matchesSearch =
      (tx.client?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (tx.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    // Case-insensitive validation against state to prevent structural mismatch
    const matchesStatus =
      statusFilter === "all" || tx.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Generates user avatar fallback using initials from full corporate or personal names
  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "TX";
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/10">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Real-time database search and filtering
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              placeholder="Search customer or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-3 py-2 text-sm bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>
          <RefreshButton />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-gray-100 dark:border-gray-800/60 pb-5">
        {["all", "succeeded", "pending", "failed"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize ${
              statusFilter === status
                ? "bg-gray-900 dark:bg-indigo-600 text-white shadow-sm"
                : "bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800/60 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <th className="pb-3.5 font-semibold">Customer</th>
              <th className="pb-3.5 font-semibold">Date</th>
              <th className="pb-3.5 font-semibold">Amount</th>
              <th className="pb-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 text-sm">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => {
                const config =
                  STATUS_CONFIG[tx.status?.toLowerCase()] ||
                  STATUS_CONFIG.failed;

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all duration-150 group/row"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 group-hover/row:border-indigo-500/30 transition-all font-mono">
                          {getInitials(tx.client)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover/row:text-indigo-500 transition-colors">
                            {tx.client}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            {tx.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {tx.date}
                    </td>

                    <td className="py-4 font-semibold text-gray-900 dark:text-white font-mono">
                      {tx.amount}
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border ${config.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                        />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-400 dark:text-gray-500 italic text-sm"
                >
                  No transactions found matching the search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
