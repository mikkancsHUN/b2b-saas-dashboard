import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 bg-gray-50 dark:bg-[#030712] min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* 🔥 Az új, tiszta, szerver-oldali Header komponensünk */}
      <Header />

      {/* Itt jelennek meg a page.tsx-ek tartalmai */}
      {children}
    </div>
  );
}
