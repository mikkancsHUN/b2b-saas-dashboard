'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function handleSignOut() {
  const cookieStore = await cookies()

  // 1. Inicializáljuk a szerver klienst
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
            // A Server Action-ökben a setAll néha hibát dobhat, ha csak törlünk, ez normális
          }
        },
      },
    }
  )

  // 2. Kiléptetjük a felhasználót a Supabase-ből (ez törli a session-t)
  await supabase.auth.signOut()

  // 3. 💥 Manuálisan is megsemmisítjük a Supabase sütiket, hogy a Middleware biztosan lássa
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')

  // 4. Átirányítjuk a login oldalra
  redirect('/login')
}