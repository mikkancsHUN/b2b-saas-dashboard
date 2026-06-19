import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col justify-center items-center p-6 overflow-hidden antialiased">
      {/* Structural grid overlay configuration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(circle_at_center,#000_60%,transparent_100%)] pointer-events-none opacity-50" />

      {/* Ambient background illumination nodes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none transform-gpu" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[130px] rounded-full pointer-events-none transform-gpu" />

      {/* Perimeter environmental indicators */}
      <div className="absolute top-12 left-12 hidden md:flex items-center gap-2 text-xs font-medium text-gray-600 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
        <span>FINANCSAAS_AUTH_NODE // SECURE_SSL</span>
      </div>
      <div className="absolute bottom-12 right-12 hidden md:block text-[10px] font-mono text-gray-700 pointer-events-none select-none">
        v4.0.0-beta.rc1
      </div>

      {/* Brand anchor tracking link */}
      <Link
        href="/"
        className="relative z-10 mb-8 text-center flex flex-col items-center gap-3 group cursor-pointer select-none"
      >
        {/* Micro-interactions managed via standard group-hover transition scaling */}
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform duration-200 group-hover:scale-105">
          <span className="text-sm font-black text-white">F</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white transition-colors duration-200 group-hover:text-gray-200">
          Finánc
          <span className="text-indigo-500 font-extrabold transition-colors duration-200 group-hover:text-indigo-400">
            SaaS
          </span>
        </h1>
      </Link>

      {/* Component layout container backplate blur */}
      <div className="relative w-full max-w-md z-10">
        <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-50 pointer-events-none" />

        {/* Encapsulated glassmorphic form view */}
        <div className="relative w-full px-8 py-9 rounded-2xl bg-gradient-to-b from-gray-900/40 to-gray-950/40 border border-gray-900/80 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {children}
        </div>
      </div>
    </div>
  );
}
