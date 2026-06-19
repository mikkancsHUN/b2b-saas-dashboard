'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleSignOut() {
  const cookieStore = await cookies()

  // 1. Initialize server-side client infrastructure
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            )
          } catch {
            // Server Actions may suppress header mutations during sequential eviction states
          }
        },
      },
    }
  )

  // 2. Terminate session mapping within the Supabase authentication provider
  await supabase.auth.signOut()

  // 3. Explicitly evict local state cookies to guarantee immediate middleware synchronization
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')

  // 4. Force state transition by redirecting to the authentication gateway
  redirect('/login')
}