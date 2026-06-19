"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { handleSignOut as serverSignOut } from "./actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

interface UserMenuProps {
  username: string;
}

// Parses usernames or corporate registration handles to extract a fallback avatar string
const getInitials = (name: string) => {
  const cleanName = name.trim();
  if (!cleanName) return "??";
  const words = cleanName.split(/\s+/);
  if (words.length === 1) return words[0].charAt(0);
  return words[0].charAt(0) + words[1].charAt(0);
};

export default function UserMenu({ username }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      showToast("Account successfully deleted.", "info");
      setIsModalOpen(false);
      router.push("/register");
      router.refresh();
    } catch (err) {
      console.error("Account deletion failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Listens for structural pointer down actions outside the container boundaries to close the dropdown context
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
      {/* Profile Toggle Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 h-8 px-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent hover:border-gray-100 dark:hover:border-gray-800/60 transition-all duration-200 focus:outline-none cursor-pointer select-none"
      >
        <div className="w-6 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-sm tracking-wider">
          {getInitials(username)}
        </div>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 hidden sm:inline">
          {username}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Action Dropdown Menu Container */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-950 rounded-xl shadow-lg border border-gray-100 dark:border-gray-900 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 p-1.5">
          <div className="px-3 py-2 mb-1.5 border-b border-gray-100 dark:border-gray-900">
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
              Signed in as
            </p>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate mt-0.5">
              {username}
            </p>
          </div>

          {/* Session Termination Execution */}
          <Button
            variant="secondary"
            isLoading={isSignOutLoading}
            onClick={async () => {
              setIsSignOutLoading(true);
              showToast("Successfully signed out.", "info");
              await serverSignOut();
            }}
            className="w-full !justify-start border-0 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-gray-750 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 px-3 h-9 text-xs font-bold rounded-lg"
          >
            Sign Out
          </Button>

          {/* Destructive Deletion Trigger */}
          <Button
            variant="secondary"
            onClick={() => {
              setIsOpen(false);
              setIsModalOpen(true);
            }}
            className="w-full !justify-start border-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 py-2 px-3 h-9 text-xs font-bold rounded-lg mt-0.5"
          >
            Delete Account
          </Button>
        </div>
      )}

      {/* Destructive Action Confirmation Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 dark:border-gray-900 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-xl flex items-center justify-center text-sm mb-4 border border-red-100 dark:border-red-900/30 font-bold">
              !
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
              Delete account permanently?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              This structural action is entirely irreversible. All associated
              metrics and cloud records will be purged.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="w-auto h-9 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                isLoading={loading}
                className="w-auto h-9 px-4 rounded-xl text-xs font-bold"
              >
                Confirm Deletion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
