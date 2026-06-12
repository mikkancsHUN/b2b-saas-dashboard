"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// Definiáljuk, milyen típusú értesítéseink lehetnek
type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Függvény az értesítés hozzáadásához (useCallback-kel, hogy stabil legyen)
  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => [...prev, { id, message, type }]);

      // 4 másodperc után automatikusan eltávolítjuk
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* 🔥 A TOAST-OK VIZUÁLIS MEGJELENÍTÉSE (A jobb alsó sarokban) */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          // Színvilág beállítása a típus alapján
          const bgColors = {
            success: "bg-emerald-500 text-white dark:bg-emerald-600",
            error: "bg-rose-500 text-white dark:bg-rose-600",
            info: "bg-indigo-500 text-white dark:bg-indigo-600",
          };

          const icons = {
            success: "✅",
            error: "❌",
            info: "ℹ️",
          };

          return (
            <div
              key={toast.id}
              className={`${bgColors[toast.type]} p-4 rounded-xl shadow-lg flex items-center gap-3 font-medium text-sm pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300`}
            >
              <span>{icons[toast.type]}</span>
              <div className="flex-1">{toast.message}</div>
              {/* Bezáró gomb */}
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="opacity-70 hover:opacity-100 transition-opacity ml-2 focus:outline-none"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// Egy egyedi hook, amivel szuper egyszerűen meghívhatjuk bárhonnan
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
