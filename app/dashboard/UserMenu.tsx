"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { handleSignOut as serverSignOut } from "./actions"; // 🔥 Átneveztük serverSignOut-ra, így nincs névütközés!
import { Button } from "@/components/ui/Button"; // 🔥 Behoztuk az új okos gombunkat
import { useToast } from "@/components/providers/ToastProvider"; // 🔥 Behoztuk a toast hookot, hogy használhassuk a szuper értesítéseket!

interface UserMenuProps {
  username: string;
}

const getInitials = (name: string) => {
  const cleanName = name.trim();
  if (!cleanName) return "??";
  const words = cleanName.split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0);
  } else {
    return words[0].charAt(0) + words[1].charAt(0);
  }
};

export default function UserMenu({ username }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false); // 🔥 State a kijelentkezés pörgéséhez
  const menuRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();

  // 🗑️ Fiók törlése kezelése
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      showToast(
        "Fiók sikeresen törölve! (Éles környezetben az auth törlés admin jogot igényel)",
        "info",
      );
      setIsModalOpen(false);
      router.push("/register");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Bezárás, ha mellékattintunk a menünek
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* 1. PROFILE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
      >
        <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
          {getInitials(username)}
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline">
          {username}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 2. DROPDOWN MENÜ */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 p-1.5">
          <div className="px-3 py-2 mb-1 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              Bejelentkezve mint
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
              {username}
            </p>
          </div>

          {/* 🔥 CSODÁS ÚJ INTELLIGENS GOMB KIJELENTKEZÉSHEZ */}
          <Button
            variant="secondary"
            isLoading={isSignOutLoading}
            onClick={async () => {
              setIsSignOutLoading(true);
              showToast("Sikeresen kijelentkeztél. Várunk vissza!", "info"); // 👈 ITT A VARÁZSLAT!
              await serverSignOut();
            }}
            className="w-full !justify-start border-0 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-750 dark:text-gray-300 py-2 px-3 h-9"
          >
            🚪 Kijelentkezés
          </Button>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsModalOpen(true);
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2 font-medium rounded-xl mt-1"
          >
            🗑️ Fiók törlése
          </button>
        </div>
      )}

      {/* 3. BIZTONSÁGI MODAL (FELUGRÓ ABLAK FIÓKTÖRLÉSHEZ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xl mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Biztosan törlöd a fiókod?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Ez a művelet teljesen visszavonhatatlan. Minden tranzakciód,
              statisztikád és beállításod véglegesen törlődik a rendszerből.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Mégse
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 disabled:bg-red-400 rounded-lg shadow-sm transition-colors"
              >
                {loading ? "Törlés..." : "Igen, törölj mindent"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
