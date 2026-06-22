import { getSupabaseServer } from "@/lib/supabaseServer";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

export default async function Header() {
  // Resolve the authenticated user profile within the server-side runtime context
  const supabaseServer = await getSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  const username =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Guest";

  return (
    <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200/60 dark:border-gray-900/80">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-gradient-to-r dark:from-white dark:to-gray-400 dark:bg-clip-text dark:text-transparent">
        Finánc
        <span className="text-indigo-500 font-extrabold">SaaS</span>
      </h1>

      <div className="flex items-center gap-3 bg-white dark:bg-gray-950 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-900">
        <ThemeToggle />
        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800" />
        <UserMenu username={username} />
      </div>
    </div>
  );
}
