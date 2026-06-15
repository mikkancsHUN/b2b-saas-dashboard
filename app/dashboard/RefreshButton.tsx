"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.refresh();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Button
      type="submit"
      onClick={handleClick}
      isLoading={isLoading}
      className="group relative w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* A menő csillogó csík megmarad a háttérben */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {/* Nem kell külön ternary operator a szövegnek, a gomb intézi az ikont mellé! */}
      <span>Frissítés</span>
    </Button>
  );
}
