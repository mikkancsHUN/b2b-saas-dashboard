import Link from "next/link";

export default function Home() {
  // Log message updated to professional English for better production debugging
  console.log("=== Success: Premium landing page loaded successfully! ===");

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 overflow-x-hidden flex flex-col justify-between antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Engineering grid overlay & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-70" />

      {/* Aurora / Glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-indigo-950/5 to-gray-950 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header / Navigation (Sticky Glassmorphism) */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-900/80 bg-gray-950/70 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="text-[10px] font-black text-white">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all">
              Finánc<span className="text-blue-500 font-extrabold">SaaS</span>
            </span>
          </div>
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 bg-gray-900/40 px-4 py-2 rounded-xl transition-all backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-20 my-auto flex flex-col items-center">
        {/* Upper feature badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-500/30 text-xs font-medium text-blue-300 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Next-Gen B2B Analytics
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] max-w-4xl">
          Gain full clarity over your <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(59,130,246,0.2)]">
            company&apos;s financial flow
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
          Track MRR metrics, monitor transaction logs, and analyze churn rates
          in real-time within a clean, premium dashboard interface.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 z-20">
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* Shimmer effect on hover (Tailwind v4 transition optimized) */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              Go to Dashboard
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>

          <a
            href="#features"
            className="px-8 py-4 font-medium text-sm text-gray-300 hover:text-white rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-900/40 backdrop-blur-sm transition-all duration-200 hover:bg-gray-900/60"
          >
            View Features
          </a>
        </div>

        {/* Bento Grid Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-24 w-full max-w-5xl mx-auto text-left">
          {/* Main Large Card (Bento Main) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-gradient-to-b from-gray-900/50 to-gray-950/50 border border-gray-900 backdrop-blur-md flex flex-col justify-between min-h-[200px] hover:border-blue-500/30 hover:scale-[1.01] transition-all duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                ⚡
              </div>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                Live Analytics
              </span>
              <h3 className="text-2xl font-bold text-white mt-2 tracking-tight">
                Real-time financial monitoring
              </h3>
              <p className="text-sm text-gray-400 mt-3 max-w-xl leading-relaxed">
                A high-performance dashboard powered by Supabase integration,
                tracking subscription lifecycles the exact second they are
                processed. Zero latency, zero data loss.
              </p>
            </div>
          </div>

          {/* Small Card (Bento Side) */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-gray-900/50 to-gray-950/50 border border-gray-900 backdrop-blur-md flex flex-col justify-between hover:border-indigo-500/30 hover:scale-[1.01] transition-all duration-300 group shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
                🛡️
              </div>
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
                Security
              </span>
              <h3 className="text-xl font-bold text-white mt-2 tracking-tight">
                SSR Architecture
              </h3>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Strict Supabase middleware-based route protection coupled with
                enterprise-grade data encryption layers.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-gray-900/60 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} FináncSaaS Project. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
