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

import { ChartDataPoint } from "./utils";

interface UsageChartProps {
  chartData: ChartDataPoint[];
}

export default function UsageChart({ chartData = [] }: UsageChartProps) {
  const data = chartData;

  // Single clean state object for all active filters
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    success: true,
    pending: false,
    failed: false,
  });

  const config = {
    all: {
      label: "Total",
      color: "bg-sky-500",
      stroke: "#0EA5E9",
      grad: "colorAll",
      dataKey: "transactions",
      name: "Total Transactions",
      strokeWidth: 3,
    },
    success: {
      label: "Succeeded",
      color: "bg-emerald-400",
      stroke: "#34D399",
      grad: "colorSuccess",
      dataKey: "successfulCount",
      name: "Succeeded",
      strokeWidth: 2.5,
    },
    pending: {
      label: "Pending",
      color: "bg-amber-400",
      stroke: "#FBBF24",
      grad: "colorPending",
      dataKey: "pendingCount",
      name: "Pending",
      strokeWidth: 2.5,
    },
    failed: {
      label: "Failed",
      color: "bg-rose-400",
      stroke: "#F43F5E",
      grad: "colorFailed",
      dataKey: "failedCount",
      name: "Failed",
      strokeWidth: 2.5,
    },
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-950 dark:to-indigo-950/20 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-indigo-950/40 backdrop-blur-md h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/30">
      {/* HEADER AND FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Transaction Volume
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Monthly breakdown of processed operations
          </p>
        </div>

        {/* DYNAMIC INTERACTIVE FILTER CONTROL */}
        <div className="flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg border border-gray-100 dark:border-gray-800 self-start sm:self-center">
          {(Object.keys(config) as Array<keyof typeof config>).map((key) => {
            const isActive = activeFilters[key];

            return (
              <button
                key={key}
                onClick={() =>
                  setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white shadow-sm border-gray-200 dark:border-gray-800"
                    : "border-transparent text-gray-400 opacity-50 hover:opacity-80 hover:bg-gray-100/50 dark:hover:bg-gray-900/30"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${config[key].color}`} />
                {config[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CHART AREA */}
      <div className="w-full h-[280px] -mx-4 pr-2 pl-0 lg:mx-0 lg:px-0 flex-1 min-h-[14rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              {(Object.keys(config) as Array<keyof typeof config>).map(
                (key) => (
                  <linearGradient
                    key={key}
                    id={config[key].grad}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={config[key].stroke}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor={config[key].stroke}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ),
              )}
            </defs>

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
              domain={[0, "dataMax + 2"]}
              tickFormatter={(value) => value.toLocaleString()}
              dx={-8}
              style={{
                fontSize: "11px",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                letterSpacing: "-0.02em",
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                borderRadius: "12px",
                border: "1px solid rgba(55, 65, 81, 0.6)",
                color: "#FFF",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />

            {/* DYNAMICALLY RENDERED AREAS BASED ON FILTERS */}
            {(Object.keys(config) as Array<keyof typeof config>).map(
              (key) =>
                activeFilters[key] && (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={config[key].dataKey}
                    name={config[key].name}
                    stroke={config[key].stroke}
                    strokeWidth={config[key].strokeWidth}
                    fillOpacity={1}
                    fill={`url(#${config[key].grad})`}
                  />
                ),
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
