export default function DashboardLoading() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200 overflow-hidden">
      {/* High-performance hardware-accelerated linear shimmer animation engine */}
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
        /* Ambient dark-mode illumination overlay mapping */
        .dark .shimmer-box::after {
          background-image: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0) 0%,
            rgba(99, 102, 241, 0.03) 20%,
            rgba(168, 85, 247, 0.12) 60%,
            rgba(99, 102, 241, 0) 100%
          );
        }
      `}</style>

      {/* SECTION 1: HIGH-LEVEL OPERATIONAL METRICS AGGREGATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between h-[142px]"
          >
            <div>
              {/* Metric Entity Label */}
              <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              {/* Numeric Metric Value & Delta Indicator */}
              <div className="flex items-baseline gap-2 mt-3">
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700/80 rounded-md shimmer-box"></div>
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              </div>
            </div>
            {/* Historical Temporal Comparison Baseline */}
            <div className="h-3 w-40 bg-gray-100 dark:bg-gray-800/40 rounded mt-2 shimmer-box"></div>

            {/* Entity 3 layout-specific nested conditional baseline expansion */}
            {i === 3 && (
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex justify-between items-center">
                <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800/40 rounded shimmer-box"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SECTION 2: SUBSIDIARY SEGMENT PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm"
          >
            {/* Segment Group Title */}
            <div className="h-4 w-44 bg-gray-200 dark:bg-gray-800 rounded mb-4 shimmer-box"></div>
            {/* Dense Data List Trackers */}
            <div className="space-y-2">
              <div className="h-7 w-full bg-gray-100 dark:bg-gray-800/30 rounded-md shimmer-box"></div>
              <div className="h-7 w-full bg-gray-100 dark:bg-gray-800/30 rounded-md shimmer-box"></div>
              <div className="h-7 w-full bg-gray-100 dark:bg-gray-800/30 rounded-md shimmer-box"></div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: ANALYTICAL CHARTING SKELETON GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Left Column Data Representation Container (Revenue Framework) */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-950 dark:to-indigo-950/20 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-indigo-950/40 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              <div className="h-3 w-44 bg-gray-100 dark:bg-gray-900 rounded shimmer-box"></div>
            </div>
            {/* Metric Resolution Filter Blocks */}
            <div className="h-7 w-40 bg-gray-150 dark:bg-gray-800 rounded-lg shimmer-box"></div>
          </div>
          {/* Histogram Bar Chart Simulation Mock */}
          <div className="flex items-end justify-between h-48 pt-4 px-2 gap-3 border-b border-gray-100 dark:border-gray-800/40 pb-1">
            {[40, 70, 55, 85, 30, 95, 60].map((height, idx) => (
              <div
                key={idx}
                style={{ height: `${height}%` }}
                className="flex-1 bg-gray-200 dark:bg-gray-800/40 rounded-t-md shimmer-box"
              ></div>
            ))}
          </div>
        </div>

        {/* Right Column Data Representation Container (Usage Framework) */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-950 dark:to-indigo-950/20 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-indigo-950/40 h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              <div className="h-3 w-48 bg-gray-100 dark:bg-gray-900 rounded shimmer-box"></div>
            </div>
            {/* Parameter Toggle Node Panel */}
            <div className="h-7 w-48 bg-gray-150 dark:bg-gray-800 rounded-lg shimmer-box"></div>
          </div>
          {/* Deterministic Structural Grid Alignment Placeholder */}
          <div className="w-full h-[240px] border border-dashed border-gray-200 dark:border-gray-800/80 rounded-xl flex items-center justify-center bg-gray-50/50 dark:bg-gray-950/10">
            <div className="w-full h-0 border-t border-dashed border-gray-200 dark:border-gray-800/80"></div>
          </div>
        </div>
      </div>

      {/* SECTION 4: LLM FINANCIAL INSIGHTS INTELLIGENCE ROW */}
      <div className="mt-8 mb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-950 dark:to-indigo-950/20 border border-blue-100 dark:border-indigo-950 p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-start space-x-3">
          {/* Intelligence Interface Node Anchor */}
          <div className="w-10 h-8 bg-gray-200/80 dark:bg-gray-800/60 rounded-lg flex-shrink-0 shimmer-box"></div>
          <div className="flex-1 space-y-2">
            {/* Analytical Agent Identification Header */}
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
            {/* Simulated Synthesized Text Stream Segment */}
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/40 rounded shimmer-box"></div>
          </div>
        </div>
      </div>

      {/* SECTION 5: HISTORICAL LEDGER TRANSACTION TABLE */}
      <div className="mt-8 bg-white dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
        {/* Ledger Viewport Header Title */}
        <div className="h-5 w-44 bg-gray-200 dark:bg-gray-800 rounded mb-6 shimmer-box"></div>

        {/* Tabular Row Iteration Matrix */}
        <div className="space-y-4">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800/40 last:border-0"
            >
              {/* Entity Context Identifiers and Timestamps */}
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-900 rounded shimmer-box"></div>
              </div>
              {/* Absolute Financial Quantity Block */}
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded shimmer-box"></div>
              {/* Cryptographic Transaction Hash / Categorization */}
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700/80 rounded shimmer-box"></div>
              {/* State Settlement Lifecycle Status Ring */}
              <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full shimmer-box"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
