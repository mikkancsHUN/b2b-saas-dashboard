"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return <div className="w-8 h-8 rounded-xl" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      // 🔥 A hover és dark:hover állapotokat átírtuk az indigo finom árnyalataira
      className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 dark:bg-gray-900/50 dark:hover:bg-indigo-950/30 dark:text-gray-400 dark:hover:text-indigo-400 border border-gray-100 dark:border-gray-800/60 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
      title={isDark ? "VALTAS_VILAGOS_MODRA" : "VALTAS_SOTET_MODRA"}
    >
      {isDark ? (
        <svg
          className="w-4 h-4 animate-in spin-in-45 duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 animate-in spin-in-90 duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M6.343 6.343l.707-.707M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      )}
    </button>
  );
}
