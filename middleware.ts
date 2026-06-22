// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Initialize the Supabase server client within the Edge Middleware execution context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Fix: Object-based cookie utility mapping to Next.js requirements
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

  // 2. Fetch authenticated user data securely from server session
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 3. ENTERPRISE ROUTE PROTECTION LOGIC

  // Redirect unauthenticated traffic attempting to access protected layout systems back to authentication
  if (url.pathname.startsWith('/dashboard') && !user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Prevent authenticated user structures from reaching gateway forms recursively
  if ((url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) && user) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

// 4. Define precise route matching definitions to optimize edge runtime executions
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};