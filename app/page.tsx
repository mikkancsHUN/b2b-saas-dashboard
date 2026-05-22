import Link from 'next/link';
export default function Home() {
  // Ide, a return UTASÍTÁS ELÉ jön a console.log.
  // Ez a rész még a tiszta logika, ami lefut, mielőtt a HTML megszületne.
  console.log("=== Helló, ez a kód fut! ===");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">
        Üdvözöllek a B2B SaaS Dashboard projektben!
      </h1>
      <Link href="/dashboard" className="mt-4 text-blue-500 hover:underline">
      Irany a Dashboard!
    </Link>
    </main>
  );
}