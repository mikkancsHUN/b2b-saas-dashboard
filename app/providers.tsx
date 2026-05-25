'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Az attribute="class" mondja meg a Tailwindnek, hogy a .dark osztályt használja
    // A defaultTheme="system" és enableSystem pedig automatikusan bekapcsolja a géped beállítását
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}