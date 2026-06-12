"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartDataPoint } from "./page";

interface UsageChartProps {
  chartData: ChartDataPoint[];
}

interface UsageChartProps {
  chartData: ChartDataPoint[];
}

export default function UsageChart({ chartData = [] }: UsageChartProps) {
  const data = chartData;

  // 🔥 1. ÁLLAPOTKEZELÉS (State): Külön-külön kapcsolható minden egyes vonal
  const [showAll, setShowAll] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showPending, setShowPending] = useState(false); // Alapból legyen kikapcsolva, hogy ne legyen túl zsúfolt
  const [showFailed, setShowFailed] = useState(false); // Alapból kikapcsolva

  // Konfiguráció a gombokhoz és a grafikon színeihez
  const config = {
    all: {
      label: "Összesen",
      color: "bg-blue-500",
      stroke: "#3B82F6",
      grad: "colorAll",
    },
    success: {
      label: "Sikeres",
      color: "bg-green-500",
      stroke: "#10B981",
      grad: "colorSuccess",
    },
    pending: {
      label: "Függőben",
      color: "bg-amber-500",
      stroke: "#F59E0B",
      grad: "colorPending",
    },
    failed: {
      label: "Meghiúsult",
      color: "bg-red-500",
      stroke: "#EF4444",
      grad: "colorFailed",
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors h-full flex flex-col justify-between">
      {/* FEJLÉC ÉS KAPCSOLÓGOMBOK */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tranzakciók Mennyisége
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Havi bontásban feldolgozott műveletek száma
          </p>
        </div>

        {/* 🔥 2. INTERAKTÍV KAPCSOLÓ PULT (Pöclikék) */}
        <div className="flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg border border-gray-100 dark:border-gray-700">
          {/* Összesen gomb */}
          <button
            onClick={() => setShowAll(!showAll)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              showAll
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 opacity-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.all.color}`} />
            {config.all.label}
          </button>

          {/* Sikeres gomb */}
          <button
            onClick={() => setShowSuccess(!showSuccess)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              showSuccess
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 opacity-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.success.color}`} />
            {config.success.label}
          </button>

          {/* Függőben gomb */}
          <button
            onClick={() => setShowPending(!showPending)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              showPending
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 opacity-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.pending.color}`} />
            {config.pending.label}
          </button>

          {/* Meghiúsult gomb */}
          <button
            onClick={() => setShowFailed(!showFailed)}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
              showFailed
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 opacity-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.failed.color}`} />
            {config.failed.label}
          </button>
        </div>
      </div>

      {/* DIAGRAM SZEKCIÓ */}
      <div className="w-full h-[300px] -mx-6 pl-2 pr-0 lg:mx-0 lg:px-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            {/* 🔥 3. GRADIENT DEFINÍCIÓK MINDEGYIK SZÍNHEZ */}
            <defs>
              {/* Kék (Összesen) */}
              <linearGradient id={config.all.grad} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={config.all.stroke}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={config.all.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
              {/* Zöld (Sikeres) */}
              <linearGradient
                id={config.success.grad}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={config.success.stroke}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={config.success.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
              {/* Sárga (Függőben) */}
              <linearGradient
                id={config.pending.grad}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={config.pending.stroke}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={config.pending.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
              {/* Vörös (Meghiúsult) */}
              <linearGradient
                id={config.failed.grad}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={config.failed.stroke}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={config.failed.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />

            <XAxis
              dataKey="month"
              className="text-xs fill-gray-500 dark:fill-gray-400"
            />
            <YAxis
              className="text-xs fill-gray-500 dark:fill-gray-400"
              domain={[0, "dataMax + 2"]}
              tickFormatter={(value) => `${value} db`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                borderRadius: "8px",
                border: "1px solid #374151",
                color: "#FFF",
              }}
            />

            {/* 🔥 4. A 4 DINAMIKUS AREA HULLÁM (Csak akkor renderelődnek, ha a hozzájuk tartozó state true!) */}
            {showAll && (
              <Area
                type="monotone"
                dataKey="transactions"
                name="Összes tranzakció"
                stroke={config.all.stroke}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${config.all.grad})`}
              />
            )}

            {showSuccess && (
              <Area
                type="monotone"
                dataKey="successfulCount"
                name="Sikeres"
                stroke={config.success.stroke}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${config.success.grad})`}
              />
            )}

            {showPending && (
              <Area
                type="monotone"
                dataKey="pendingCount"
                name="Függőben"
                stroke={config.pending.stroke}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${config.pending.grad})`}
              />
            )}

            {showFailed && (
              <Area
                type="monotone"
                dataKey="failedCount"
                name="Meghiúsult"
                stroke={config.failed.stroke}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${config.failed.grad})`}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
