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

      // Automatically evict toast state data after a 4000ms lifecycle duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Pure CSS keyframe declarations ensuring environment-agnostic animation tracking */}
      <style>{`
        @keyframes toast-progress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        
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

        .toast-animate-entry {
          animation: toast-slide-in 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Toast notification rendering node container */}
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
              {/* Minimalist status icon indicator wrapper */}
              <div
                className={`w-5 h-5 rounded-lg border border-current ${textColors[toast.type]} flex items-center justify-center text-xs font-black shrink-0 bg-gray-900/40`}
              >
                {icons[toast.type]}
              </div>

              {/* Message payload element */}
              <div className="flex-1 text-xs font-semibold text-gray-200 tracking-tight leading-relaxed">
                {toast.message}
              </div>

              {/* User eviction trigger control */}
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="text-gray-500 hover:text-gray-300 text-[10px] transition-colors ml-2 focus:outline-none cursor-pointer"
              >
                ✕
              </button>

              {/* Linear timeline indicator synchronization bar */}
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
