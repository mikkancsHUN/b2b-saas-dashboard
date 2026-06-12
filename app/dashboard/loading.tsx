// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200 overflow-hidden">
      
      {/* PERFECT B2B SHIMMER (FÉNYCSÍK) ENGINE */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .shimmer-box {
          position: relative;
          overflow: hidden;
        }
        .shimmer-box::after {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 20%,
            rgba(255, 255, 255, 0.7) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite ease-in-out;
          content: '';
        }
        /* Ultra-finom, selymes fénycsík sötét módhoz */
        .dark .shimmer-box::after {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.02) 15%,
            rgba(255, 255, 255, 0.07) 55%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}</style>

      {/* ================= 1. CÍMSOR ÉS GOMBOK ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* Főcím */}
          <div className="h-8 w-56 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2 shimmer-box"></div>
          {/* Alcím */}
          <div className="h-4 w-40 bg-gray-200/60 dark:bg-gray-800/60 rounded-md shimmer-box"></div>
        </div>
        
        {/* Jobb oldali vezérlők */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-800 rounded-lg shimmer-box"></div>
          <div className="w-24 h-9 bg-gray-200 dark:bg-gray-800 rounded-lg shimmer-box"></div>
        </div>
      </div>

      {/* ================= 2. FŐ METRIKA RÁCS (1-4 KÁRTYA) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between h-[142px]">
            <div>
              {/* Kártya neve */}
              <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              {/* Érték + Százalékos badge */}
              <div className="flex items-baseline gap-2 mt-3">
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-md shimmer-box"></div>
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              </div>
            </div>
            {/* Alsó kontextus szöveg */}
            <div className="h-3 w-40 bg-gray-100 dark:bg-gray-800/60 rounded mt-2 shimmer-box"></div>
            
            {/* A 3. kártya egyedi elválasztója és extra sora */}
            {i === 3 && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800/60 rounded shimmer-box"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= 3. TERMINÁL PANELKÉK (5-8 KÁRTYA) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {/* Szekció címe */}
            <div className="h-4 w-44 bg-gray-200 dark:bg-gray-800 rounded mb-4 shimmer-box"></div>
            {/* Listaelemek (3 tranzakciós sáv) */}
            <div className="space-y-2">
              <div className="h-7 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md shimmer-box"></div>
              <div className="h-7 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md shimmer-box"></div>
              <div className="h-7 w-full bg-gray-100 dark:bg-gray-800/50 rounded-md shimmer-box"></div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= 4. DIAGRAM RÁCS (RevenueChart és UsageChart) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Bal oldali grafikon (BarChart) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              <div className="h-3 w-44 bg-gray-100 dark:bg-gray-900 rounded shimmer-box"></div>
            </div>
            {/* Szűrő gombok */}
            <div className="h-7 w-40 bg-gray-150 dark:bg-gray-800 rounded-lg shimmer-box"></div>
          </div>
          {/* Oszlopdiagram imitáció */}
          <div className="flex items-end justify-between h-48 pt-4 px-2 gap-3 border-b border-gray-100 dark:border-gray-800/60 pb-1">
            {[40, 70, 55, 85, 30, 95, 60].map((height, idx) => (
              <div key={idx} style={{ height: `${height}%` }} className="flex-1 bg-gray-200 dark:bg-gray-800/60 rounded-t-md shimmer-box"></div>
            ))}
          </div>
        </div>

        {/* Jobb oldali grafikon (AreaChart) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              <div className="h-3 w-48 bg-gray-100 dark:bg-gray-900 rounded shimmer-box"></div>
            </div>
            {/* Kapcsoló pult */}
            <div className="h-7 w-48 bg-gray-150 dark:bg-gray-800 rounded-lg shimmer-box"></div>
          </div>
          {/* Tiszta, elegáns belső háló placeholder */}
          <div className="w-full h-[240px] border border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center bg-gray-50/50 dark:bg-gray-950/20">
            <div className="w-full h-0 border-t border-dashed border-gray-200 dark:border-gray-800"></div>
          </div>
        </div>
      </div>

      {/* ================= 5. AI ASSZISZTENS ELEMZÉS SZEKCIÓ ================= */}
      <div className="mt-8 mb-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-start space-x-3">
          {/* AI logó helye */}
          <div className="w-10 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg flex-shrink-0 shimmer-box"></div>
          <div className="flex-1 space-y-2">
            {/* Asszisztens neve */}
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
            {/* Generált szövegcsík */}
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/50 rounded shimmer-box"></div>
          </div>
        </div>
      </div>

      {/* ================= 6. TRANZAKCIÓS TÁBLÁZAT SZEKCIÓ ================= */}
      <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        {/* Táblázat fejléce */}
        <div className="h-5 w-44 bg-gray-200 dark:bg-gray-800 rounded mb-6 shimmer-box"></div>
        
        {/* Táblázat sorok */}
        <div className="space-y-4">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800/50">
              {/* Tranzakció neve és dátuma */}
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-900 rounded shimmer-box"></div>
              </div>
              {/* Összeg */}
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              {/* ID / Típus */}
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              {/* Státusz badge */}
              <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full shimmer-box"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}