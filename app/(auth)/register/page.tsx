'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 🔥 JAVÍTÁS: Itt is az új klienst indítjuk el
    const supabase = getSupabaseClient();

    // 🔥 Supabase regisztráció meghívása
   const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        // 👇 JAVÍTÁS: Mostantól pontosan a 'display_name' kulcsot küldjük be!
        data: {
        display_name: username.trim(), 
        }
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fiók létrehozása</h2>
        <p className="text-xs text-gray-400 mt-1">Regisztrálj, hogy hozzáférj a dashboardhoz.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-955/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg border border-red-100 dark:border-red-900/50">
          ⚠️ {error}
        </div>
      )}

      {success ? (
        <div className="text-center py-4 space-y-3">
          <div className="text-3xl">📨</div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Sikeres regisztráció!</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Küldtünk egy megerősítő linket az email címedre. Kérjük, kattints rá a fiókod aktiválásához!
          </p>
          <div className="pt-4">
            <Link href="/login" className="text-xs text-indigo-505 font-bold hover:text-indigo-400 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-lg transition-colors">
              Vissza a bejelentkezéshez
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
            <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Felhasználónév
            </label>
            <input
                type="type"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                placeholder="username123"
            />
            </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Email cím
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Jelszó
            </label>
            <div className="relative">
                <input
                type={showPassword ? 'text' : 'password'} // <-- Dinamikus típus váltás!
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors"
                placeholder="••••••••"
                />
                {/* A kis interaktív szem gomb az input jobb szélén */}
                <button
                type="button" // <-- KRITIKUS: button típusú legyen, különben a formot akarná beküldeni!
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                {showPassword ? (
                    // 👁️ Áthúzott szem ikon (ha látható a jelszó)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                ) : (
                    // 👁️ Nyitott szem ikon (ha rejtett a jelszó)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
                </button>
            </div>
            </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200"
          >
            {loading ? 'Fiók létrehozása...' : 'Regisztráció indítása ✨'}
          </button>
        </form>
      )}

      {!success && (
        <div className="mt-6 text-center border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs text-gray-400">
            Már van fiókod?{' '}
            <Link href="/login" className="text-indigo-500 hover:text-indigo-400 font-bold">
              Jelentkezz be
            </Link>
          </p>
        </div>
      )}
    </>
  );
}