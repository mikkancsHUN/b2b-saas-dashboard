import { supabase } from "@/lib/supabase";
import { generateChartData, calculateMRRMetrics } from "./utils";
import { getAiFinancialAnalysis } from "./aiService";
import MetricCards from "./MetricCards";
import RevenueChart from "./RevenueChart";
import UsageChart from "./UsageChart";
import AiAnalysis from "./AiAnalysis";
import AddTransactionForm from "./AddTransactionForm";
import TransactionTable from "./TransactionTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // 1. Data Fetching Phase (Server-side execution context)
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  const safeTransactions = transactions || [];

  // 2. Data Processing and Transformation Pipeline
  const liveChartData = generateChartData(safeTransactions);
  const mrrMetrics = calculateMRRMetrics(safeTransactions);

  // 3. AI Financial Analysis Telemetry Compilation
  const { aiAnalysis, isRateLimited } = await getAiFinancialAnalysis({
    currentMRR: mrrMetrics.currentMRR,
    currentMonthCount: mrrMetrics.uniqueCustomers.currentMonthCount,
    globalChurnRate: mrrMetrics.globalChurnRate,
    safeTransactions,
  });

  return (
    <div className="bg-gray-50 dark:bg-[#030712] min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* High-level operational metrics aggregate matrix */}
      <MetricCards metrics={mrrMetrics} />

      {/* Analytical charting visual representations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 items-stretch">
        <RevenueChart chartData={liveChartData} />
        <UsageChart chartData={liveChartData} />
      </div>

      {/* LLM-driven deterministic financial insights engine */}
      <AiAnalysis analysis={aiAnalysis} isRateLimited={isRateLimited} />

      {/* Transaction state mutation controller */}
      <div className="mb-8">
        <AddTransactionForm />
      </div>

      {/* Tabular historic transaction ledger component */}
      <TransactionTable initialTransactions={safeTransactions} />
    </div>
  );
}
