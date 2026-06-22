"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getSupabaseClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          display_name: username.trim(),
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Create your account
        </h2>
        <p className="text-xs text-gray-400 mt-1.5">
          Sign up to gain full access to the dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-900/20 text-red-400 text-xs font-medium rounded-xl border border-red-900/40 backdrop-blur-sm flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
              />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">
              Registration successful
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              We have sent a verification link to your email address. Please
              click the link to activate your account.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-block text-xs text-gray-300 font-bold hover:text-white border border-gray-800 hover:border-gray-700 bg-gray-900/50 px-5 py-2.5 rounded-xl transition-all backdrop-blur-sm"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-950/60 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-600 transition-all duration-200"
              placeholder="username123"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-950/60 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-600 transition-all duration-200"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-11 bg-gray-950/60 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white placeholder-gray-600 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="group relative w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 overflow-hidden transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span>Get Started</span>
          </Button>
        </form>
      )}

      {!success && (
        <div className="mt-6 text-center border-t border-gray-900 pt-5">
          <p className="text-xs text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
