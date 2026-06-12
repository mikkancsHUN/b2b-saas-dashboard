"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider"; // 👈 1. Beimportáljuk a Toast-ot
import { Button } from "@/components/ui/Button"; // 👈 2. Beimportáljuk az okos gombot

export default function AddTransactionForm() {
  const router = useRouter();
  const { showToast } = useToast(); // 👈 3. Aktiváljuk a Toast hookot

  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Sikeres");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Sima alert helyett figyelmeztető Toast notification
    if (!client || !amount) {
      return showToast("Kérlek tölts ki minden kötelező mezőt! ⚠️", "info");
    }

    setLoading(true);

    // Formázzuk az összeget, hogy dollár jellel menjen az adatbázisba (pl: 500 -> $500)
    const formattedAmount = amount.startsWith("$")
      ? amount
      : `$${Number(amount).toLocaleString("en-US")}`;

    // 🔥 ELKÜLDÉS A SUPABASE-NEK
    const { error } = await supabase.from("transactions").insert([
      {
        client: client,
        email: email,
        amount: formattedAmount,
        status: status,
        date: new Date().toISOString().split("T")[0], // Mai dátum: YYYY-MM-DD
      },
    ]);

    setLoading(false);

    if (error) {
      // ❌ Hiba esetén piros Toast üzenet
      showToast(`Hiba történt a mentés során: ${error.message}`, "error");
    } else {
      // ✅ Siker esetén gyönyörű zöld Toast értesítés!
      showToast("Tranzakció sikeresen hozzáadva! 💸", "success");

      // Mezők kiürítése
      setClient("");
      setAmount("");
      setEmail("");

      // Frissítjük az oldalt, hogy a Next.js újra lekérje az adatokat a szerverről
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 max-w-2xl transition-colors duration-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Új tranzakció rögzítése
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Ügyfél neve */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ügyfél neve
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Pl: Volvo AB"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Ügyfél Email címe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email cím
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@volvo.se"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Összeg (dollárban) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Összeg (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Pl: 2500"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Státusz választó */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Státusz
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="Sikeres">Sikeres</option>
            <option value="Függőben">Függőben</option>
            <option value="Meghiúsult">Meghiúsult</option>
          </select>
        </div>
      </div>

      {/* 🔥 4. LECSERÉLVE AZ ÚJ OKOS GOMBRA */}
      <Button
        type="submit"
        isLoading={loading}
        className="w-auto px-5" // Felülírjuk az alap w-full-t, hogy ne legyen batár nagy a gomb
      >
        Tranzakció hozzáadása
      </Button>
    </form>
  );
}
