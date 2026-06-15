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
  // 1. ÉLŐ ADATLEKÉRÉS
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  const safeTransactions = transactions || [];

  // 2. ADATFELDOLGOZÁS
  const liveChartData = generateChartData(safeTransactions);
  const mrrMetrics = calculateMRRMetrics(safeTransactions);

  // 3. AI ELEMZÉS MEGHÍVÁSA A KÜLSŐ SZERVIZBŐL
  const { aiAnalysis, isRateLimited } = await getAiFinancialAnalysis({
    currentMRR: mrrMetrics.currentMRR,
    currentMonthCount: mrrMetrics.uniqueCustomers.currentMonthCount,
    globalChurnRate: mrrMetrics.globalChurnRate,
    safeTransactions,
  });

  return (
    <div className="bg-gray-50 dark:bg-[#030712] min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* 8 Fő metrika kártya */}
      <MetricCards metrics={mrrMetrics} />

      {/* Diagramok szekció */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 items-stretch">
        <RevenueChart chartData={liveChartData} />
        <UsageChart chartData={liveChartData} />
      </div>

      {/* AI Asszisztens doboz */}
      <AiAnalysis analysis={aiAnalysis} isRateLimited={isRateLimited} />

      {/* Új tranzakció felvétele form */}
      <div className="mb-8">
        <AddTransactionForm />
      </div>

      {/* Tranzakciós előzmények táblázat */}
      <TransactionTable initialTransactions={safeTransactions} />
    </div>
  );
}
