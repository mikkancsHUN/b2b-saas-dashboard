"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
// 🔥 1. IMPORTÁLJUK A HIVATALOS RECHARTS TÍPUSOKAT
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ChartDataPoint } from "./utils";

interface RevenueChartProps {
  chartData: ChartDataPoint[];
}

type RevenueStatus = "successful" | "pending" | "failed";

export default function RevenueChart({ chartData = [] }: RevenueChartProps) {
  const data = chartData;
  const [activeStatus, setActiveStatus] = useState<RevenueStatus>("successful");

  const statusConfig = {
    successful: {
      label: "Sikeres",
      dotColor: "bg-green-400",
      fill: "#22C55E", // Ultra vibráló zöld
      hoverFill: "#4ADE80", // Hoverre még világosabb lesz (neon hatás)
      textClass: "text-green-500 dark:text-green-400",
      borderColor: "hover:border-green-400/40",
    },
    pending: {
      label: "Függőben",
      dotColor: "bg-yellow-400",
      fill: "#EAB308", // Elektromos sárga
      hoverFill: "#FACC15",
      textClass: "text-yellow-500 dark:text-yellow-400",
      borderColor: "hover:border-yellow-400/40",
    },
    failed: {
      label: "Meghiúsult",
      dotColor: "bg-red-500",
      fill: "#FF3366", // Brutál dögös skarlát/neon piros
      hoverFill: "#FF5E84",
      textClass: "text-red-500 dark:text-red-400",
      borderColor: "hover:border-red-500/40",
    },
  };

  // 🔥 2. KIKÖTÖZZÜK A FORMATTER FÜGGVÉNYT EGY HINT-EL ELLÁTOTT, SZIGORÚ TÍPUSÚ FÜGGVÉNYBE
  const customFormatter = (
    value: ValueType | undefined,
  ): [ValueType, NameType] => {
    const numericValue = typeof value === "number" ? value : Number(value) || 0;
    return [
      `$${numericValue.toLocaleString("en-US")}`,
      statusConfig[activeStatus].label,
    ];
  };

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-950 dark:to-indigo-950/20 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-indigo-950/40 backdrop-blur-md h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${statusConfig[activeStatus].borderColor}`}
    >
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

        {/* PÖCLIKÉS FILTER GOMB */}
        <div className="flex gap-1 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg border border-gray-100 dark:border-gray-800 self-start sm:set-center">
          {(["successful", "pending", "failed"] as RevenueStatus[]).map(
            (status) => {
              const isActive = activeStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  // 🔥 BEKERÜLT A border border-transparent, az aktív ágban pedig csak a színt állítjuk (border-gray-200 dark:border-gray-800)
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 border ${
                    isActive
                      ? "bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white shadow-sm border-gray-200 dark:border-gray-800"
                      : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-900/30"
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
      </div>

      {/* RECHARTS GRAFIKON TERÜLET */}
      <div className="w-full h-[280px] -mx-4 pr-2 pl-0 lg:mx-0 lg:px-0 flex-1 min-h-[14rem]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-100 dark:stroke-gray-800/50"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              className="fill-gray-400 dark:fill-gray-500"
              dy={10}
              // 🔥 KÖZVETLEN SVG STÍLUS: Finom, tiszta sans-serif, csupa nagybetű, szellős betűköz
              style={{
                fontSize: "10px",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="fill-gray-400 dark:fill-gray-500"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              dx={-8}
              // 🔥 KÖZVETLEN SVG STÍLUS: Steril, letisztult monospaced számok
              style={{
                fontSize: "11px",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                letterSpacing: "-0.02em",
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(156, 163, 175, 0.05)", radius: 6 }}
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                borderRadius: "12px",
                border: "1px solid rgba(55, 65, 81, 0.6)",
                color: "#FFF",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              // 🔥 3. ÁTADJUK A SZIGORÚAN TÍPUSOZOTT FÜGGVÉNYT
              formatter={customFormatter}
              labelFormatter={(label) => `${label} statisztika`}
            />
            <Bar
              dataKey={activeStatus}
              fill={statusConfig[activeStatus].fill}
              activeBar={{ fill: statusConfig[activeStatus].hoverFill }}
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
