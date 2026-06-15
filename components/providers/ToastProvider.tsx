"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => [...prev, { id, message, type }]);

      // 4 másodperc (4000ms) után automatikusan eltávolítjuk
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TISZTA CSS ANIMÁCIÓK - Így biztosan működik plugin nélkül is! */}
      <style>{`
        @keyframes toast-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        
        /* Új, bombabiztos jobbról-balra becsúszás */
        @keyframes toast-slide-in {
          0% {
            transform: translateX(120%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-progress-bar {
          animation: toast-progress 4000ms linear forwards;
        }

        /* Ruganyos, natív hatású animációs osztály */
        .toast-animate-entry {
          animation: toast-slide-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* TOAST-OK VIZUÁLIS MEGJELENÍTÉSE */}
      {/* Kicsit igazítottunk a konténeren (p-2 és overflow-hidden törölve a széleken), hogy a rugózás ne vágódjon le */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((toast) => {
          const textColors = {
            success: "text-emerald-400",
            error: "text-rose-400",
            info: "text-indigo-400",
          };

          const icons = {
            success: "✓",
            error: "✕",
            info: "ℹ",
          };

          return (
            <div
              key={toast.id}
              className="relative bg-gray-950/70 border border-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-[0_10px_3px_rgba(0,0,0,0.04),0_20px_25px_-5px_rgba(0,0,0,0.3)] flex items-center gap-3 pointer-events-auto overflow-hidden transform hover:scale-[1.01] transition-all toast-animate-entry"
            >
              {/* Prémium minimalista ikon karika */}
              <div
                className={`w-5 h-5 rounded-lg border border-current ${textColors[toast.type]} flex items-center justify-center text-xs font-black shrink-0 bg-gray-900/40`}
              >
                {icons[toast.type]}
              </div>

              {/* Szöveg részlet */}
              <div className="flex-1 text-xs font-semibold text-gray-200 tracking-tight leading-relaxed">
                {toast.message}
              </div>

              {/* Bezáró gomb */}
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="text-gray-500 hover:text-gray-300 text-[10px] transition-colors ml-2 focus:outline-none cursor-pointer"
              >
                ✕
              </button>

              {/* AZ INDIGO SÁV AMI VÉGIGFUT AZ ALJÁN */}
              <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500 toast-progress-bar" />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
