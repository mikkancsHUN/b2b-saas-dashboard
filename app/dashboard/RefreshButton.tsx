"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    // Forces a non-blocking background data re-validation of server components
    startTransition(() => {
      router.refresh();

      // Artificial timeout to guarantee smooth animation feedback loop
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      isLoading={isLoading}
      // Fixed height and auto-width enforced to match adjacent filter input dimensions exactly
      className="group relative !w-auto h-[38px] px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex items-center justify-center"
    >
      {/* Shimmer overlay effect triggered on group hover */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <span>Refresh</span>
    </Button>
  );
}
