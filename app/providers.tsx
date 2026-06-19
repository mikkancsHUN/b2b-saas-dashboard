"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // attribute="class" instructs Tailwind to use the .dark utility class injection
    // defaultTheme="system" and enableSystem automatically sync with the user's OS preference
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
