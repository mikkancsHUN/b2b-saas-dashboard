"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";

export default function AddTransactionForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Sikeres");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client || !amount) {
      return showToast("Kérlek tölts ki minden kötelező mezőt! ⚠️", "info");
    }

    setLoading(true);

    // Tiszta formázás vesszők nélkül, hogy a utils.ts pontosan tudjon vele számolni
    const numericAmount = amount.replace(/[^0-9.-]+/g, "");
    const formattedAmount = `$${numericAmount}`;

    const { error } = await supabase.from("transactions").insert([
      {
        client: client.trim(),
        email: email.trim() || null,
        amount: formattedAmount,
        status: status,
        date: new Date().toISOString().split("T")[0], // Mai nap (YYYY-MM-DD)
      },
    ]);

    setLoading(false);

    if (error) {
      showToast(`Hiba történt a mentés során: ${error.message}`, "error");
    } else {
      showToast("Tranzakció sikeresen hozzáadva! 💸", "success");
      setClient("");
      setAmount("");
      setEmail("");
      router.refresh(); // Frissíti a szerveroldali page.tsx-et, így azonnal újraszámol minden kártya és grafikon!
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md max-w-4xl transition-all duration-300 hover:border-indigo-500/20"
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Új tranzakció rögzítése
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Adj hozzá egy új fizetési tételt a rendszerhez szabadon tesztelhető
          adatokkal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Ügyfél neve */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
            Ügyfél neve <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Pl: Volvo AB"
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-gray-50/50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-200"
          />
        </div>

        {/* Ügyfél Email címe */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
            Email cím
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info@volvo.se"
            className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-gray-50/50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-200"
          />
        </div>

        {/* Összeg (dollárban) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
            Összeg (USD) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 dark:text-gray-600 text-sm font-mono">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2500"
              className="w-full pl-8 pr-3.5 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-mono bg-gray-50/50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-200"
            />
          </div>
        </div>

        {/* Státusz választó */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
            Státusz
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-gray-50/50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer transition-all duration-200"
            >
              <option value="Sikeres">Sikeres</option>
              <option value="Függőben">Függőben</option>
              <option value="Meghiúsult">Meghiúsult</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 dark:text-gray-600">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          isLoading={loading}
          className="group relative w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          <span>Tranzakció rögzítése</span>
        </Button>
      </div>
    </form>
  );
}
