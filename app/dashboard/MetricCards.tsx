import {
  DollarSign,
  TrendingUp,
  Building2,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface MetricCardsProps {
  metrics: {
    currentMRR: number;
    percentageChange: number;
    isPositive: boolean;
    totalRevenue: number;
    globalChurnRate: string;
    successTx: {
      current: number;
      total: number;
      change: number;
      isPositive: boolean;
    };
    flowTx: {
      current: number;
      total: number;
      change: number;
      isPositive: boolean;
    };
    pending: {
      current: number;
      total: number;
      change: number;
      isPositive: boolean;
    };
    failed: {
      current: number;
      total: number;
      change: number;
      isPositive: boolean;
    };
    uniqueCustomers: {
      currentMonthCount: number;
      totalAllTimeCount: number;
      changeText: string;
      isPositive: boolean;
    };
  };
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* ================= PRIMARY METRICS ROW ================= */}

      {/* 1. CARD: MRR */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Monthly Recurring Revenue
          </p>
          <TrendingUp className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white font-mono">
            ${metrics.currentMRR.toLocaleString("en-US")}
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${metrics.isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400"}`}
          >
            {metrics.isPositive ? "▲" : "▼"} {metrics.percentageChange}%
          </span>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
          ⚡ vs. previous month
        </p>
      </div>

      {/* 2. CARD: TOTAL REVENUE */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Total Revenue
          </p>
          <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white font-mono">
            ${metrics.totalRevenue.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-lg text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/20">
            All-Time
          </span>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
          Cumulative volume of all settled transactions
        </p>
      </div>

      {/* 3. CARD: ACTIVE CUSTOMERS */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Active Customers
          </p>
          <Building2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            {metrics.uniqueCustomers.currentMonthCount} Active
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-lg ${metrics.uniqueCustomers.isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400"}`}
          >
            {metrics.uniqueCustomers.changeText}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center text-[11px]">
          <span className="text-gray-400 dark:text-gray-500">
            Total customer base:
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 px-2 py-0.5 rounded-md">
            {metrics.uniqueCustomers.totalAllTimeCount} total
          </span>
        </div>
      </div>

      {/* 4. CARD: CHURN */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Churn Rate
          </p>
          <AlertTriangle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white font-mono">
            {metrics.globalChurnRate}%
          </span>
        </div>
        <span
          className={`text-[11px] font-medium px-2 py-1 rounded-md mt-3 inline-flex items-center gap-1.5 w-full justify-center ${metrics.failed.isPositive ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/10" : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10"}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${metrics.failed.isPositive ? "bg-rose-500" : "bg-emerald-500"}`}
          />
          {metrics.failed.current} failed payments this month
        </span>
      </div>

      {/* ================= OPERATIONAL METRICS ROW ================= */}

      {/* 5. CARD: TRANSACTION FLOW */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <Activity className="h-3.5 w-3.5" /> Transaction Flow
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Current month:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {metrics.flowTx.current} ops
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Volume momentum:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.flowTx.isPositive ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"}`}
            >
              {metrics.flowTx.isPositive ? "+" : "-"}
              {metrics.flowTx.change}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Total processed:</span>
            <span className="font-mono font-bold text-blue-500 dark:text-blue-400">
              {metrics.flowTx.total} txs
            </span>
          </div>
        </div>
      </div>

      {/* 6. CARD: SETTLED TRANSACTIONS */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <CheckCircle2 className="h-3.5 w-3.5" /> Settled Volume
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Current month:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {metrics.successTx.current} txs
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Monthly delta:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.successTx.isPositive ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"}`}
            >
              {metrics.successTx.isPositive ? "+" : "-"}
              {metrics.successTx.change}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">All-time settled:</span>
            <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">
              {metrics.successTx.total} units
            </span>
          </div>
        </div>
      </div>

      {/* 7. CARD: PENDING QUEUE */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <Clock className="h-3.5 w-3.5" /> Pending Queue
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Active queue:</span>
            <span
              className={`font-semibold ${metrics.pending.current > 0 ? "text-amber-400" : "text-emerald-400"}`}
            >
              {metrics.pending.current} items
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Queue velocity:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.pending.isPositive ? "text-amber-400 bg-amber-500/5" : "text-emerald-400 bg-emerald-500/5"}`}
            >
              {metrics.pending.isPositive ? "+" : "-"}
              {metrics.pending.change}%{" "}
              {metrics.pending.isPositive ? "congestion" : "cleared"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Lifetime pending:</span>
            <span className="font-mono font-bold text-gray-500 dark:text-gray-400">
              {metrics.pending.total} total
            </span>
          </div>
        </div>
      </div>

      {/* 8. CARD: CRITICAL FAILURES */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-600/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          <XCircle className="h-3.5 w-3.5" /> Critical Failures
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Monthly dropouts:</span>
            <span
              className={`font-semibold ${metrics.failed.current > 0 ? "text-rose-400" : "text-emerald-400"}`}
            >
              {metrics.failed.current} errors
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Anomaly flux:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.failed.isPositive ? "text-rose-400 bg-rose-500/5" : "text-emerald-400 bg-emerald-500/5"}`}
            >
              {metrics.failed.isPositive ? "+" : "-"}
              {metrics.failed.change}%{" "}
              {metrics.failed.isPositive ? "regression" : "recovery"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Cumulative failed:</span>
            <span className="font-mono font-bold text-rose-500">
              {metrics.failed.total} events
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
