// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Inicializáljuk a Supabase klienst a Middleware-ben is
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 🔥 Itt van az objektum-alapú javítás, amit a legújabb Next.js elvár
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  // 2. Lekérjük a bejelentkezett felhasználót
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 3. 🚨 BIZTONSÁGI LOGIKA

  // Ha a felhasználó a /dashboard-ra akar menni, de NINCS bejelentkezve:
  if (url.pathname.startsWith('/dashboard') && !user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Ha a felhasználó a /login vagy /register oldalra megy, de MÁR BE VAN jelentkezve:
  if ((url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) && user) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

// 4. Megadjuk, hogy mely útvonalakon fusson le a Middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};