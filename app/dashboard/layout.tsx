import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 bg-gray-50 dark:bg-[#030712] min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Decoupled server-side header layout module */}
      <Header />

      {/* Primary viewport rendering node for child page contexts */}
      {children}
    </div>
  );
}
