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
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ChartDataPoint } from "./utils";

interface RevenueChartProps {
  chartData: ChartDataPoint[];
}

// CRITICAL: Aligned with your database standard ("succeeded")
type RevenueStatus = "succeeded" | "pending" | "failed";

export default function RevenueChart({ chartData = [] }: RevenueChartProps) {
  const data = chartData;
  const [activeStatus, setActiveStatus] = useState<RevenueStatus>("succeeded");

  const statusConfig = {
    succeeded: {
      label: "Succeeded",
      dataKey: "successful" as const, // Maps perfectly to ChartDataPoint.successful
      dotColor: "bg-emerald-400",
      fill: "#10B981", // Premium Emerald Green
      hoverFill: "#34D399",
      textClass: "text-emerald-500 dark:text-emerald-400",
      borderColor: "hover:border-emerald-400/40",
    },
    pending: {
      label: "Pending",
      dataKey: "pending" as const, // ChartDataPoint.pending
      dotColor: "bg-amber-400",
      fill: "#F59E0B", // Vivid Amber
      hoverFill: "#FBBF24",
      textClass: "text-amber-500 dark:text-amber-400",
      borderColor: "hover:border-amber-400/40",
    },
    failed: {
      label: "Failed",
      dataKey: "failed" as const, // ChartDataPoint.failed
      dotColor: "bg-rose-500",
      fill: "#F43F5E", // Cyber Rose/Red
      hoverFill: "#FB7185",
      textClass: "text-rose-500 dark:text-rose-400",
      borderColor: "hover:border-rose-500/40",
    },
  };

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
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Revenue Overview
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Monthly financial performance analytics
          </p>
        </div>

        {/* STATUS FILTER BUTTONS */}
        <div className="flex gap-1 bg-gray-50 dark:bg-gray-950 p-1 rounded-lg border border-gray-100 dark:border-gray-800 self-start sm:items-center">
          {(["succeeded", "pending", "failed"] as RevenueStatus[]).map(
            (status) => {
              const isActive = activeStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
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

      {/* RECHARTS AREA */}
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
              formatter={customFormatter}
              labelFormatter={(label) => `${label} Performance`}
            />
            <Bar
              dataKey={statusConfig[activeStatus].dataKey} // Safely maps to the correct data key
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
