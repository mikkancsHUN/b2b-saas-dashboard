'use client';

import { useState } from "react";
import RefreshButton from "./RefreshButton";

interface Transaction {
    id: string;
    client: string;
    email: string;
    amount: string;
    status: string;
    date: string;
}

interface TransactionTableProps {
    initialTransactions: Transaction[]
}

export default function TransactionTable({ initialTransactions }: TransactionTableProps) {
  // Állapotok a keresésnek és a státusz szűrésnek
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Összes'); // Összes, Sikeres, Függőben, Meghiúsult

  // 🔥 A VARÁZSLAT: Valós időben szűrjük a tömböt a React állapot alapján
  const filteredTransactions = initialTransactions.filter((tx) => {
    // 1. Megnézzük, hogy a név vagy email tartalmazza-e a keresett szót (kis/nagybetű nem számít)
    const matchesSearch = 
      tx.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.email.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Megnézzük, hogy a státusz megegyezik-e a kiválasztott gombbal
    const matchesStatus = statusFilter === 'Összes' || tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      
      {/* FEJLÉC ÉS AZ ÚJ SZŰRŐ INPUTOK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Legutóbbi Tranzakciók</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Keresés és szűrés valós időben</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* KERESŐMEZŐ (INPUT) */}
          <input
            type="text"
            placeholder="Ügyfél vagy email keresése..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 w-full md:w-64 transition-colors"
          />
          <RefreshButton />
        </div>
      </div>

      {/* STÁTUSZ GOMBOK */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        {['Összes', 'Sikeres', 'Függőben', 'Meghiúsult'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
              statusFilter === status
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TÁBLÁZAT */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
              <th className="pb-3">Ügyfél</th>
              <th className="pb-3">Dátum</th>
              <th className="pb-3">Összeg</th>
              <th className="pb-3">Státusz</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{tx.client}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{tx.email}</div>
                  </td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{tx.date}</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{tx.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      tx.status === 'Sikeres' ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' :
                      tx.status === 'Függőben' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' :
                      'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 dark:text-gray-500 italic">
                  Nincs a keresésnek megfelelő tranzakció.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}