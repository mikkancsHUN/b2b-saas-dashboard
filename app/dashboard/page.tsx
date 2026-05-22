// src/app/dashboard/page.tsx
import { GoogleGenerativeAI } from '@google/generative-ai';
import RefreshButton from "./RefreshButton";
import ThemeToggle from './ThemeToggle';
export default async function DashboardPage() {
  // Ez a mi fiktív cégünk "adatbázisa"
  const stats = {
    revenue: { title: "Havi Ismétlődő Bevétel (MRR)", amount: "$15,200", change: "+12%", positive: true },
    users: { title: "Aktív Felhasználók", amount: "1,240", change: "+5%", positive: true },
    churn: { title: "Lemorzsolódási Arány (Churn)", amount: "2.1%", change: "-0.4%", positive: true }
  };
  const transactions = [
  { id: "1", client: "Acme Corp", email: "billing@acme.com", amount: "$1,200", status: "Sikeres", date: "2026-05-21" },
  { id: "2", client: "Initech LLC", email: "finance@initech.com", amount: "$350", status: "Függőben", date: "2026-05-20" },
  { id: "3", client: "Cyberdyne Systems", email: "john@cyberdyne.com", amount: "$2,500", status: "Meghiúsult", date: "2026-05-19" },
  ];

  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const prompt = `Légy egy profi B2B SaaS pénzügyi tanácsadó. Elemezd a következő adatokat:
  Havi bevétel: ${stats.revenue.amount} (${stats.revenue.change})
  Aktív felhasználók: ${stats.users.amount}
  Lemorzsolódás: ${stats.churn.amount}

  Írj egy rövid, 3 mondatos, pontos és professzionális magyar nyelvű elemzést a cég helyzetéről!`;

  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const response = await model.generateContent(prompt);
  const aiAnalysis = response.response.text();



  return (
  <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
    {/* Címsor */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pénzügyi Irányítópult</h1>
      <ThemeToggle />
    </div>

    {/* A RÁCS (GRID) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 1. KÁRTYA: Bevétel */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stats.revenue.title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.revenue.amount}</p>
        <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md mt-2 inline-block">
          {stats.revenue.change} az előző hónaphoz képest
        </span>
      </div>

      {/* 2. KÁRTYA: Felhasználók */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stats.users.title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.users.amount}</p>
        <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md mt-2 inline-block">
          {stats.users.change}
        </span>
      </div>

      {/* 3. KÁRTYA: Churn */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stats.churn.title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.churn.amount}</p>
        <span className={`text-sm font-medium px-2 py-1 rounded-md mt-2 inline-block ${
          stats.churn.positive 
            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30" 
            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
        }`}>
          {stats.churn.change} az előző hónaphoz képest
        </span>
      </div>
    </div>

    {/* AI ELEMZÉS SZEKCIÓ */}
    <div className="mt-8 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 border border-blue-100 dark:border-indigo-900/50 p-6 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-200/20 rounded-full blur-xl pointer-events-none" />
      <div className="flex items-start space-x-3">
        <div className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
          AI
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-indigo-200 uppercase tracking-wide">
            Intelligens Pénzügyi Asszisztens
          </h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
            {aiAnalysis}
            {/* Ideiglenesen pihen az AI elemző, de a helye már be van melegítve! */}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-blue-100/50 flex items-center text-xs text-blue-500">
    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
    Élő adatok alapján elemezve a Gemini 2.5 által
  </div>
    </div>

    {/* TRANZAKCIÓK TÁBLÁZAT */}
    <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Legutóbbi Tranzakciók</h2>
      <div className="mb-4">
        <RefreshButton />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
              <th className="pb-3">Ügyfél</th>
              <th className="pb-3">Dátum</th>
              <th className="pb-3">Összeg</th>
              <th className="pb-3">Státusz</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{tx.client}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{tx.email}</div>
                </td>
                <td className="py-3 text-gray-500 dark:text-gray-400">{tx.date}</td>
                <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{tx.amount}</td>
                <td className="py-3">
                  <span className="text-sm">{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}