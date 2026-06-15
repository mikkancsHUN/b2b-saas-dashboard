// Definiáljuk a prop típusát, hogy a VS Code pontosan tudja, milyen adatokat várunk a utils-ból
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
      {/* ================= ELSŐ SOR: FŐ METRIKÁK ================= */}

      {/* 1. KÁRTYA: MRR */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Havi Ismétlődő Bevétel (MRR)
          </p>
          <span className="text-lg">📊</span>
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
          ⚡ az előző hónaphoz képest
        </p>
      </div>

      {/* 2. KÁRTYA: TOTAL REVENUE */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Összes Bevétel (Total)
          </p>
          <span className="text-lg">💰</span>
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
          Az összes sikeres tranzakció kumulált értéke
        </p>
      </div>

      {/* 3. KÁRTYA: AKTÍV ÜGYFELEK */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Aktív Ügyfelek (Cégek)
          </p>
          <span className="text-lg">🏢</span>
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
            {metrics.uniqueCustomers.currentMonthCount} cég
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-lg ${metrics.uniqueCustomers.isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400"}`}
          >
            {metrics.uniqueCustomers.changeText}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center text-[11px]">
          <span className="text-gray-400 dark:text-gray-500">
            Mindenkori bázis:
          </span>
          <span className="font-semibold text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 px-2 py-0.5 rounded-md">
            {metrics.uniqueCustomers.totalAllTimeCount} egyedi partner
          </span>
        </div>
      </div>

      {/* 4. KÁRTYA: CHURN */}
      <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Lemorzsolódás (Churn)
          </p>
          <span className="text-lg">⚠️</span>
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
          {metrics.failed.current} failed payment ebben a hónapban
        </span>
      </div>

      {/* ================= MÁSODIK SOR: MŰVELETI METRIKÁK ================= */}

      {/* 5. KÁRTYA: TRANZAKCIÓK ÁRAMLÁSA */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          🔄 Tranzakciók Áramlása
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Jelenlegi hónap:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {metrics.flowTx.current} művelet
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Trend változás:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.flowTx.isPositive ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"}`}
            >
              {metrics.flowTx.isPositive ? "+" : "-"}
              {metrics.flowTx.change}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Összes indított:</span>
            <span className="font-mono font-bold text-blue-500 dark:text-blue-400">
              {metrics.flowTx.total} db
            </span>
          </div>
        </div>
      </div>

      {/* 6. KÁRTYA: SIKERES TRANZAKCIÓK */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          ✓ Sikeres Teljesítések
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Jelenlegi hónap:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {metrics.successTx.current} db
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Havi növekedés:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.successTx.isPositive ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"}`}
            >
              {metrics.successTx.isPositive ? "+" : "-"}
              {metrics.successTx.change}%
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Mindenkori összes:</span>
            <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">
              {metrics.successTx.total} db
            </span>
          </div>
        </div>
      </div>

      {/* 7. KÁRTYA: FÜGGŐBEN LÉVŐK */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          ⏳ Függőben lévő tételek
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Aktuális queue:</span>
            <span
              className={`font-semibold ${metrics.pending.current > 0 ? "text-amber-400" : "text-emerald-400"}`}
            >
              {metrics.pending.current} db
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Feldolgozási ráta:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.pending.isPositive ? "text-amber-400 bg-amber-500/5" : "text-emerald-400 bg-emerald-500/5"}`}
            >
              {metrics.pending.isPositive ? "+" : "-"}
              {metrics.pending.change}%{" "}
              {metrics.pending.isPositive ? "torlódás" : "tisztulás"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Mindösszesen:</span>
            <span className="font-mono font-bold text-gray-500 dark:text-gray-400">
              {metrics.pending.total} db
            </span>
          </div>
        </div>
      </div>

      {/* 8. KÁRTYA: MEGHÍÚSULTAK */}
      <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-600/30">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
        <p className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
          🚨 Kritikus hibák
        </p>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Havi hibaarány:</span>
            <span
              className={`font-semibold ${metrics.failed.current > 0 ? "text-rose-400" : "text-emerald-400"}`}
            >
              {metrics.failed.current} db
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
            <span className="text-gray-400">Anomália változás:</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${metrics.failed.isPositive ? "text-rose-400 bg-rose-500/5" : "text-emerald-400 bg-emerald-500/5"}`}
            >
              {metrics.failed.isPositive ? "+" : "-"}
              {metrics.failed.change}%{" "}
              {metrics.failed.isPositive ? "romlás" : "javulás"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-gray-400">Eddigi összes hiba:</span>
            <span className="font-mono font-bold text-rose-500">
              {metrics.failed.total} tétel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
