export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Ide jöhet majd az appod logója */}
        <h1 className="text-3xl font-extrabold text-indigo-650 dark:text-indigo-400 tracking-tight">
          B2B SaaS Dashboard
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100 dark:border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}