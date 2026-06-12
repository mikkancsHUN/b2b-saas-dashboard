"use client";

import { useState } from "react";
import { ChartDataPoint } from "./page";

interface RevenueChartProps {
  chartData: ChartDataPoint[];
}

// 🔥 TypeScript szigorú típus a 3 gombhoz
type RevenueStatus = "successful" | "pending" | "failed";

export default function RevenueChart({ chartData = [] }: RevenueChartProps) {
  const data = chartData;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 🔥 1. ÚJ STATE: Alapból a sikeres összegeket mutatjuk
  const [activeStatus, setActiveStatus] = useState<RevenueStatus>("successful");

  // 🔥 2. DINAMIKUS DIZÁJN KONFIGURÁCIÓ: A kiválasztott gombhoz igazítja a grafikon színeit
  const statusConfig = {
    successful: {
      label: "Sikeres",
      dotColor: "bg-green-500",
      barActive: "bg-green-500 shadow-green-500/20",
      barInactive: "bg-green-100 dark:bg-green-950/30",
      textClass: "text-green-600 dark:text-green-400",
    },
    pending: {
      label: "Függőben",
      dotColor: "bg-amber-500",
      barActive: "bg-amber-500 shadow-amber-500/20",
      barInactive: "bg-amber-100 dark:bg-amber-950/30",
      textClass: "text-amber-600 dark:text-amber-400",
    },
    failed: {
      label: "Meghiúsult",
      dotColor: "bg-red-500",
      barActive: "bg-red-500 shadow-red-500/20",
      barInactive: "bg-red-100 dark:bg-red-950/30",
      textClass: "text-red-600 dark:text-red-400",
    },
  };

  // 🔥 3. JAVÍTÁS: Mindig az éppen aktív státusz maximumát keressük meg a százalékhoz
  const maxRevenue = Math.max(...data.map((item) => item[activeStatus]), 1);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      {/* FEJLÉC ÉS FILTEREK */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Bevételi Trendek
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Havi bontású pénzügyi statisztika
          </p>
        </div>

        {/* 🔥 4. A 3 PÖCLIKÉS FILTER GOMB */}
        <div className="flex gap-1 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg border border-gray-100 dark:border-gray-800 self-start sm:self-center">
          {(["successful", "pending", "failed"] as RevenueStatus[]).map(
            (status) => {
              const isActive = activeStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-800"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusConfig[status].dotColor} ${isActive ? "animate-pulse" : "opacity-60"}`}
                  />
                  {statusConfig[status].label}
                </button>
              );
            },
          )}
        </div>

        {/* HOVER INFORMÁCIÓS PANEL (Dollár formázással) */}
        <div className="text-right h-10 sm:h-auto min-w-[120px]">
          {hoveredIndex !== null ? (
            <div>
              <span className="text-xs text-gray-400 block">
                {data[hoveredIndex].month}i{" "}
                {statusConfig[activeStatus].label.toLowerCase()}:
              </span>
              <span
                className={`text-sm font-bold ${statusConfig[activeStatus].textClass}`}
              >
                ${data[hoveredIndex][activeStatus].toLocaleString("en-US")}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic leading-10 block">
              Húzd rá az egeret!
            </span>
          )}
        </div>
      </div>

      {/* A GRAFIKON TERÜLETE */}
      <div className="relative h-64 lg:h-auto lg:flex-1 mt-4 min-h-[12rem]">
        {/* VÍZSZINTES RÁCSVONALAK */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
        </div>

        {/* OSZLOPOK REGENERÁLÁSA */}
        <div className="absolute inset-0 flex justify-between items-end pt-4 px-2 gap-3">
          {data.map((item, index) => {
            const currentAmount = item[activeStatus];
            const calculatedPercent = (currentAmount / maxRevenue) * 100;
            const heightPercent =
              currentAmount > 0 ? Math.max(calculatedPercent, 4) : 0;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col justify-end h-full items-center group cursor-pointer z-10"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Az oszlop maga dinamikus Tailwind színekkel */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 relative ${
                    hoveredIndex === index
                      ? statusConfig[activeStatus].barActive + " shadow-lg"
                      : statusConfig[activeStatus].barInactive
                  }`}
                >
                  {/* Kis lebegő buborék hover esetén (Dollár formázással) */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 font-bold shadow-md">
                    ${currentAmount.toLocaleString("en-US")}
                  </div>
                </div>

                {/* Hónap felirat */}
                <span className="text-xs text-gray-400 mt-2 font-medium absolute -mb-6">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-6 flex-shrink-0" />
    </div>
  );
}
