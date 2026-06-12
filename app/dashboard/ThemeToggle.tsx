"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// Egy pici segédfüggvény, ami megmondja a Reactnak, hogy a kliensen vagyunk-e
const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Kliens oldalon ezt az értéket adja vissza
    () => false, // Szerver oldalon (SSR) ezt az értéket adja vissza
  );
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted(); // 🔥 0% useEffect, 0% linter hiba!

  // Amíg a szerveren vagyunk, egy üres dobozt mutatunk, hogy ne ugorjon a dizájn
  if (!mounted) {
    return <div className="w-[110px] h-[38px]" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
    >
      {theme === "dark" ? "🌙 Sötét mód" : "☀️ Világos mód"}
    </button>
  );
}
