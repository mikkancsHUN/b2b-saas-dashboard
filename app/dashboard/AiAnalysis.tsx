"use client";

interface AiAnalysisProps {
  analysis: string;
  isRateLimited: boolean;
}

export default function AiAnalysis({
  analysis,
  isRateLimited,
}: AiAnalysisProps) {
  return (
    <div className="mt-8 mb-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-950 dark:to-indigo-950/20 border border-blue-100 dark:border-indigo-950 p-6 rounded-2xl shadow-sm relative overflow-hidden">
      {/* Background ambient glow element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start space-x-3">
        {/* Core AI Tech Badge */}
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-blue-500/20">
          AI
        </div>

        <div className="flex-1">
          <h3 className="text-xs font-bold text-blue-900 dark:text-indigo-300 uppercase tracking-widest">
            Intelligent Financial Assistant
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
            {analysis}
          </p>
        </div>
      </div>

      {/* Infrastructure Status Footer */}
      <div className="mt-4 pt-3 border-t border-blue-100/30 dark:border-indigo-900/30 flex items-center text-[11px] text-blue-500 dark:text-indigo-400 font-medium">
        {/* Dynamic status glow indicator driven by rate-limit states */}
        <span
          className={`flex h-2 w-2 rounded-full mr-2 transform-gpu ${
            isRateLimited
              ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse"
              : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse"
          }`}
        />
        {isRateLimited
          ? "Gemini API rate limit reached – temporarily offline"
          : "Analyzing live data streams powered by Gemini"}
      </div>
    </div>
  );
}
