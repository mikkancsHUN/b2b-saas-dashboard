import { GoogleGenerativeAI } from "@google/generative-ai";
import RevenueChart from "./RevenueChart";
import ThemeToggle from "./ThemeToggle";
import TransactionTable from "./TransactionTable";
import { supabase } from "@/lib/supabase";
import AddTransactionForm from "./AddTransactionForm";
import UsageChart from "./UsageChart";
import UserMenu from "./UserMenu";
import { getSupabaseServer } from "@/lib/supabaseServer";

// 1. 🔥 TÍPUS DEFINÍCIÓ: Ez határozza meg, pontosan milyen adatokat kaphatnak a diagramok
export interface ChartDataPoint {
  month: string;
  successful: number;
  pending: number;
  failed: number;
  transactions: number;
  successfulCount: number; // 💡 Győződj meg róla, hogy ezek itt vannak!
  pendingCount: number;
  failedCount: number;
}

// Tranzakció típus a Supabase adatokhoz
interface TransactionData {
  id: string; // vagy number, amilyen a Supabase-ben
  amount: string;
  status: string;
  date: string | null;
  client: string; // 💡 Itt a valódi ügyfélnév!
  email: string;
}

// 🔥 Ez a sor kikapcsolja a cache-elést ezen az oldalon, így mindig a legfrissebb adatot kapod a Supabase-ből:
export const dynamic = "force-dynamic";

// Segédfüggvény a tranzakciók hónapok szerinti csoportosításához
function generateChartData(transactions: TransactionData[]): ChartDataPoint[] {
  const monthlyData: {
    [key: string]: {
      month: string;
      successful: number;
      pending: number;
      failed: number;
      txCount: number;
      successCount: number;
      pendingCount: number;
      failedCount: number; // 💡 Új számlálók
    };
  } = {
    "01": {
      month: "Jan",
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    },
    "02": {
      month: "Feb",
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    },
    "03": {
      month: "Már",
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    },
    "04": {
      month: "Ápr",
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    },
    "05": {
      month: "Máj",
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    },
    "06": {
      month: "Jún",
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    },
  };

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const monthKey = tx.date.split("-")[1];

    if (monthlyData[monthKey]) {
      monthlyData[monthKey].txCount += 1;

      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

      // 🔥 Itt gyűjtjük az összeget ÉS a darabszámot is egyszerre!
      if (tx.status === "Sikeres") {
        monthlyData[monthKey].successful += amount;
        monthlyData[monthKey].successCount += 1;
      } else if (tx.status === "Függőben") {
        monthlyData[monthKey].pending += amount;
        monthlyData[monthKey].pendingCount += 1;
      } else if (tx.status === "Meghiúsult") {
        monthlyData[monthKey].failed += amount;
        monthlyData[monthKey].failedCount += 1;
      }
    }
  });

  return Object.keys(monthlyData)
    .sort()
    .map((key) => ({
      month: monthlyData[key].month,
      successful: monthlyData[key].successful,
      pending: monthlyData[key].pending,
      failed: monthlyData[key].failed,
      transactions: monthlyData[key].txCount,
      // 🔥 Átadjuk a darabszámokat a UsageChart-nak
      successfulCount: monthlyData[key].successCount,
      pendingCount: monthlyData[key].pendingCount,
      failedCount: monthlyData[key].failedCount,
    }));
}

// 2. 🔥 EZ AZ ÚJ FÜGGVÉNY A KÉT KÁRTYÁHOZ (MRR + ÖSSZES BEVÉTEL)
function calculateMRRMetrics(transactions: TransactionData[]) {
  const successfulTx = transactions.filter(
    (tx) => tx.status === "Sikeres" && tx.date,
  );

  // Összes sikeres bevétel
  const totalRevenue = successfulTx.reduce((sum, tx) => {
    const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(cleanAmount) ? 0 : cleanAmount);
  }, 0);

  const totalSuccessCount = successfulTx.length;
  const totalFailedCount = transactions.filter(
    (tx) => tx.status === "Meghiúsult",
  ).length;
  const totalPendingCount = transactions.filter(
    (tx) => tx.status === "Függőben",
  ).length;

  // Mindenkori összes egyedi cég kigyűjtése (Bárki, aki valaha bekerült a rendszerbe)
  const globalUniqueCustomers = new Set<string>();
  transactions.forEach((tx) => {
    if (tx.client && tx.client.trim() !== "") {
      globalUniqueCustomers.add(tx.client.trim());
    }
  });

  if (transactions.length === 0) {
    return {
      currentMRR: 0,
      percentageChange: 0,
      isPositive: true,
      totalRevenue: 0,
      successTx: { current: 0, total: 0, change: 0, isPositive: true },
      flowTx: { current: 0, total: 0, change: 0, isPositive: true },
      pending: { current: 0, total: 0, change: 0, isPositive: true },
      failed: { current: 0, total: 0, change: 0, isPositive: true },
      uniqueCustomers: {
        currentMonthCount: 0,
        totalAllTimeCount: 0,
        changeText: "0% változás",
        isPositive: true,
      },
    };
  }

  // Dátumkezelés a legfrissebb tranzakció alapján (2026-06-12)
  const dates = transactions
    .filter((tx) => tx.date)
    .map((tx) => new Date(tx.date || ""));
  const latestDate =
    dates.length > 0
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : new Date();

  const currentYear = latestDate.getFullYear();
  const currentMonth = latestDate.getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let currentMonthTotal = 0;
  let prevMonthTotal = 0;
  let currentMonthSuccess = 0;
  let prevMonthSuccess = 0;
  let currentMonthPending = 0;
  let prevMonthPending = 0;
  let currentMonthFailed = 0;
  let prevMonthFailed = 0;

  let currentMonthFlowCount = 0;
  let prevMonthFlowCount = 0;

  // Csak a SIKERESEN fizető egyedi ügyfelek gyűjtése havi bontásban
  const currentMonthCustomersSet = new Set<string>();
  const prevMonthCustomersSet = new Set<string>();

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const txDate = new Date(tx.date);
    if (isNaN(txDate.getTime())) return;

    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();

    // Havi tranzakció folyamat számlálása (bármilyen státusz)
    if (txYear === currentYear && txMonth === currentMonth) {
      currentMonthFlowCount++;
    } else if (txYear === prevYear && txMonth === prevMonth) {
      prevMonthFlowCount++;
    }

    // Sikeresek, MRR és Aktív Ügyfél szűrés
    if (tx.status === "Sikeres") {
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

      if (txYear === currentYear && txMonth === currentMonth) {
        currentMonthTotal += amount;
        currentMonthSuccess++;
        if (tx.client && tx.client.trim() !== "")
          currentMonthCustomersSet.add(tx.client.trim());
      } else if (txYear === prevYear && txMonth === prevMonth) {
        prevMonthTotal += amount;
        prevMonthSuccess++;
        if (tx.client && tx.client.trim() !== "")
          prevMonthCustomersSet.add(tx.client.trim());
      }
    }

    // Függőben lévők
    if (tx.status === "Függőben") {
      if (txYear === currentYear && txMonth === currentMonth)
        currentMonthPending++;
      else if (txYear === prevYear && txMonth === prevMonth) prevMonthPending++;
    }

    // Meghiúsultak
    if (tx.status === "Meghiúsult") {
      if (txYear === currentYear && txMonth === currentMonth)
        currentMonthFailed++;
      else if (txYear === prevYear && txMonth === prevMonth) prevMonthFailed++;
    }
  });

  // Javított változás-számító függvény: megtartja a valódi irányt!
  const getChange = (current: number, prev: number) => {
    if (prev > 0) {
      const change = ((current - prev) / prev) * 100;
      return {
        change: Math.round(Math.abs(change)),
        isPositive: change >= 0,
        rawChange: change,
      };
    }
    return {
      change: current > 0 ? 100 : 0,
      isPositive: true,
      rawChange: current > 0 ? 100 : 0,
    };
  };

  const mrrChange = getChange(currentMonthTotal, prevMonthTotal);
  const successChange = getChange(currentMonthSuccess, prevMonthSuccess);
  const flowChange = getChange(currentMonthFlowCount, prevMonthFlowCount);
  const pendingChange = getChange(currentMonthPending, prevMonthPending);
  const failedChange = getChange(currentMonthFailed, prevMonthFailed);
  const customerChange = getChange(
    currentMonthCustomersSet.size,
    prevMonthCustomersSet.size,
  );

  // Mindenkori Churn ráta kiszámítása az összes meghiúsult / összes indított arányában
  const totalTxCount = transactions.length;
  const globalChurnRate =
    totalTxCount > 0
      ? ((totalFailedCount / totalTxCount) * 100).toFixed(1)
      : "0.0";

  return {
    currentMRR: currentMonthTotal,
    percentageChange: mrrChange.change,
    isPositive: mrrChange.isPositive,
    totalRevenue,
    globalChurnRate,
    successTx: {
      current: currentMonthSuccess,
      total: totalSuccessCount,
      change: successChange.change,
      isPositive: successChange.isPositive,
    },
    flowTx: {
      current: currentMonthFlowCount,
      total: totalTxCount,
      change: flowChange.change,
      isPositive: flowChange.isPositive,
    },
    pending: {
      current: currentMonthPending,
      total: totalPendingCount,
      change: pendingChange.change,
      isPositive: pendingChange.isPositive,
    },
    failed: {
      current: currentMonthFailed,
      total: totalFailedCount,
      change: failedChange.change,
      isPositive: failedChange.isPositive,
    },
    uniqueCustomers: {
      currentMonthCount: currentMonthCustomersSet.size,
      totalAllTimeCount: globalUniqueCustomers.size,
      changeText: `${customerChange.isPositive ? "+" : "-"}${customerChange.change}%`,
      isPositive: customerChange.isPositive,
    },
  };
}

export default async function DashboardPage() {
  // Ez a mi fiktív cégünk "adatbázisa"
  // ÉLŐ ADATLEKÉRÉS A FELHŐBŐL:
  // 🔥 Meghívjuk a szerver klienst
  const supabaseServer = await getSupabaseServer();
  // Lekérjük az aktuális bejelentkezett felhasználót a Supabase-ből
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();
  console.log("ÚJ SZERVER USER DATA:", user?.user_metadata);
  // Ha van felhasználó, kiszedjük a regisztrációnál megadott felhasználónevet, különben 'Vendég'
  const username =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Vendég";
  // Lekérjük az összes oszlopot (*) a 'transactions' táblából, és a legújabbakat tesszük előre
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  // Ha valami hiba történne az adatbázissal, kiírjuk a konzolra, és üres tömböt adunk vissza
  if (error) {
    console.error("Hiba az adatok lekérése közben:", error.message);
  }

  const safeTransactions = transactions || [];

  // A diagramok adatai
  const liveChartData = generateChartData(safeTransactions);

  // 🔥 ITT AZ ÚJ SOR: A kártyák adatai az új közös függvényből!
  const mrrMetrics = calculateMRRMetrics(safeTransactions);

  // DINAMIKUS MRR KISZÁMÍTÁSA
  // Összeadjuk a "Sikeres" tranzakciók értékeit
  const totalRevenue = safeTransactions
    .filter((tx) => tx.status === "Sikeres") // Csak a sikereseket vesszük figyelembe
    .reduce((sum, tx) => {
      // Megtisztítjuk a szöveget: kitöröljük a '$' jelet és a vesszőket, majd számmá alakítjuk
      // Pl: "$1,200" -> "1200" -> 1200
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(cleanAmount) ? 0 : cleanAmount);
    }, 0);

  // Formázzuk a kapott összeget, hogy újra szép dollár formátuma legyen (pl: $1,550)
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  // EGYEDI ÜGYFELEK KISZÁMÍTÁSA
  // Kigyűjtjük az összes tranzakcióból a kliensek neveit egy egyedi halmazba (Set)
  const uniqueClients = new Set(safeTransactions.map((tx) => tx.client));
  // Megszámoljuk, hány elem maradt a halmazban
  const activeUsersCount = uniqueClients.size;

  // LEMORZSOLÓDÁSI ARÁNY (CHURN) KISZÁMÍTÁSA
  // Megszámoljuk a meghiúsult tranzakciókat
  const failedTransactions = safeTransactions.filter(
    (tx) => tx.status === "Meghiúsult",
  ).length;
  // Kiszámoljuk a százalékot az összes tranzakcióhoz képest
  // Ha még nincs tranzakció, akkor 0%, különben (meghiúsult / összes) * 100
  const churnRate =
    safeTransactions.length > 0
      ? (failedTransactions / safeTransactions.length) * 100
      : 0;
  // Formázzuk szép tizedesjegyes formátumra (pl: 2.1%)
  const formattedChurn = `${churnRate.toFixed(1)}%`;

  // 2. A statisztikák objektum, ahol az MRR-t lecseréljük a frissen kiszámolt értékre
  const stats = {
    revenue: {
      title: "Havi Ismétlődő Bevétel (MRR)",
      amount: formattedRevenue, // <-- ITT A VARÁZSLAT! Élő, számolt adat
      change: "+12%",
      positive: true,
    },
    users: {
      title: "Aktív Ügyfelek",
      amount: activeUsersCount.toString(),
      change: `Összesen ${safeTransactions.length} tranzakció`,
      positive: true,
    },
    churn: {
      title: "Sikertelen Fizetések (Churn)",
      amount: formattedChurn,
      change: `${failedTransactions} meghiúsult tranzakció`,
      positive: churnRate < 15,
    },
    // Ha a churn 15% felett van, akkor piros jelzést kap, ha alatta, akkor zöld (jó)
  };

  // AZ AI LOGIKA – GOLYÓÁLLÓ VERZIÓ RATE LIMIT KEZELÉSSEL
  let aiAnalysis = "Az AI asszisztens épp elemzi az adatokat";
  let isRateLimited = false; // Elalvó állapot jelzője a pöttyhöz

  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Részletes tranzakciós lista összeállítása a nyers adatokból
    const transactionSummary = safeTransactions
      .map((tx) => `- ${tx.client}: ${tx.amount} (${tx.status}, ${tx.date})`)
      .join("\n");

    const prompt = `
    Légy egy profi B2B SaaS pénzügyi tanácsadó. Elemezd a következő élő adatokat:
    Havi bevétel: ${stats.revenue.amount}
    Aktív felhasználók: ${stats.users.amount}
    Lemorzsolódás: ${stats.churn.amount}

    Részletes tranzakciók:
    ${transactionSummary}

    Írj egy rövid, maximum 2-3 mondatos, tűpontos és professzionális magyar nyelvű elemzést vagy javaslatot a cég helyzetéről! 
    Nyers szöveget adj vissza, ne használj semmilyen markdown formázást (csillagokat, kettőskereszteket, listajeleket).
  `;

    const response = await model.generateContent(prompt);
    aiAnalysis = response.response.text();
  } catch (error) {
    console.error("Gemini hiba:", error);
    isRateLimited = true; // Bármi hiba/rate limit van, bekapcsoljuk a piros jelzést
    aiAnalysis =
      "Az intelligens asszisztens jelenleg pihen (Rate Limit elérve). Frissítsd az oldalt egy kicsit később!";
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-[#030712] min-h-screen transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Címsor */}
      <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200/60 dark:border-gray-900/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-gradient-to-r dark:from-white dark:to-gray-400 dark:bg-clip-text dark:text-transparent">
            Pénzügyi Irányítópult
          </h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            Üdvözlünk újra a rendszerben! Élő piaci szinkronizáció aktív.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-gray-950 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-900">
          <ThemeToggle />
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800" />
          <UserMenu username={username} />
        </div>
      </div>

      {/* A RÁCS (GRID) - PRÉMIUM ELIT SAAS TUNING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ================= ELSŐ SOR: FŐ METRIKÁK ================= */}

        {/* 1. KÁRTYA: MRR (Finom tőzsdei indigo beütéssel) */}
        <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Havi Ismétlődő Bevétel (MRR)
            </p>
            <span className="text-lg">📊</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white font-mono">
              ${mrrMetrics.currentMRR.toLocaleString("en-US")}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${
                mrrMetrics.isPositive
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400"
              }`}
            >
              {mrrMetrics.isPositive ? "▲" : "▼"} {mrrMetrics.percentageChange}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
            <span>⚡</span> az előző hónaphoz képest
          </p>
        </div>

        {/* 2. KÁRTYA: ÖSSZES EDDIGI BEVÉTEL */}
        <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Összes Bevétel (Total)
            </p>
            <span className="text-lg">💰</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white font-mono">
              ${mrrMetrics.totalRevenue.toLocaleString("en-US")}
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-lg text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/20">
              All-Time
            </span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
            Az összes sikeres tranzakció kumulált értéke
          </p>
        </div>

        {/* 3. KÁRTYA: AKTÍV ÜGYFELEK */}
        <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Aktív Ügyfelek (Cégek)
            </p>
            <span className="text-lg">🏢</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
              {mrrMetrics.uniqueCustomers.currentMonthCount} cég
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                mrrMetrics.uniqueCustomers.isPositive
                  ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400"
              }`}
            >
              {mrrMetrics.uniqueCustomers.changeText}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex justify-between items-center text-[11px]">
            <span className="text-gray-400 dark:text-gray-500">
              Mindenkori bázis:
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 px-2 py-0.5 rounded-md">
              {mrrMetrics.uniqueCustomers.totalAllTimeCount} egyedi partner
            </span>
          </div>
        </div>

        {/* 4. KÁRTYA: DINAMIKUS CHURN (Veszélyzóna vörös neon kiemeléssel) */}
        <div className="group relative bg-white dark:bg-gray-900/40 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Lemorzsolódás (Churn)
            </p>
            <span className="text-lg">⚠️</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white font-mono">
              {mrrMetrics.globalChurnRate}%
            </span>
          </div>
          <span
            className={`text-[11px] font-medium px-2 py-1 rounded-md mt-3 inline-flex items-center gap-1.5 w-full justify-center ${
              mrrMetrics.failed.isPositive
                ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/10"
                : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/10"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${mrrMetrics.failed.isPositive ? "bg-rose-500" : "bg-emerald-500"}`}
            />
            {mrrMetrics.failed.current} meghiúsult fizetés ebben a hónapban
          </span>
        </div>

        {/* ================= MÁSODIK SOR: MŰVELETI METRIKÁK (TŐZSDÉI SÁVOS STRUKTÚRA - LUXUS KIADÁS) ================= */}

        {/* 5. KÁRTYA: TRANZAKCIÓK ÁRAMLÁSA */}
        <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <span className="text-sm">🔄</span> Tranzakciók Áramlása
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Jelenlegi hónap:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                {mrrMetrics.flowTx.current} művelet
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Trend változás:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded ${mrrMetrics.flowTx.isPositive ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"}`}
              >
                {mrrMetrics.flowTx.isPositive ? "+" : "-"}
                {mrrMetrics.flowTx.change}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-0.5">
              <span className="text-gray-400">Összes indított:</span>
              <span className="font-mono font-bold text-blue-500 dark:text-blue-400">
                {mrrMetrics.flowTx.total} db
              </span>
            </div>
          </div>
        </div>

        {/* 6. KÁRTYA: SIKERES TRANZAKCIÓK */}
        <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <span className="text-sm">✓</span> Sikeres Teljesítések
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Jelenlegi hónap:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-200">
                {mrrMetrics.successTx.current} db
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Havi növekedés:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded ${mrrMetrics.successTx.isPositive ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"}`}
              >
                {mrrMetrics.successTx.isPositive ? "+" : "-"}
                {mrrMetrics.successTx.change}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-0.5">
              <span className="text-gray-400">Mindenkori összes:</span>
              <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">
                {mrrMetrics.successTx.total} db
              </span>
            </div>
          </div>
        </div>

        {/* 7. KÁRTYA: FÜGGŐBEN LÉVŐ TRANZAKCIÓK */}
        <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <p className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <span className="text-sm">⏳</span> Függőben lévő tételek
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Aktuális queue:</span>
              <span
                className={`font-semibold ${mrrMetrics.pending.current > 0 ? "text-amber-400" : "text-emerald-400"}`}
              >
                {mrrMetrics.pending.current} db
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Feldolgozási ráta:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded ${mrrMetrics.pending.isPositive ? "text-amber-400 bg-amber-500/5" : "text-emerald-400 bg-emerald-500/5"}`}
              >
                {mrrMetrics.pending.isPositive ? "+" : "-"}
                {mrrMetrics.pending.change}%{" "}
                {mrrMetrics.pending.isPositive ? "torlódás" : "tisztulás"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-0.5">
              <span className="text-gray-400">Mindösszesen:</span>
              <span className="font-mono font-bold text-gray-500 dark:text-gray-400">
                {mrrMetrics.pending.total} db
              </span>
            </div>
          </div>
        </div>

        {/* 8. KÁRTYA: MEGHÍÚSULT TRANZAKCIÓK */}
        <div className="group relative bg-white dark:bg-gray-900/20 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-600/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
          <p className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
            <span className="text-sm">🚨</span> Kritikus hibák
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Havi hibaarány:</span>
              <span
                className={`font-semibold ${mrrMetrics.failed.current > 0 ? "text-rose-400" : "text-emerald-400"}`}
              >
                {mrrMetrics.failed.current} db
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-800/40 pb-2">
              <span className="text-gray-400">Anomália változás:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded ${mrrMetrics.failed.isPositive ? "text-rose-400 bg-rose-500/5" : "text-emerald-400 bg-emerald-500/5"}`}
              >
                {mrrMetrics.failed.isPositive ? "+" : "-"}
                {mrrMetrics.failed.change}%{" "}
                {mrrMetrics.failed.isPositive ? "romlás" : "javulás"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-0.5">
              <span className="text-gray-400">Eddigi összes hiba:</span>
              <span className="font-mono font-bold text-rose-500">
                {mrrMetrics.failed.total} tétel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KÖZÖS DIAGRAM RÁCS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 items-stretch">
        <RevenueChart chartData={liveChartData} />
        <UsageChart chartData={liveChartData} />
      </div>

      {/* AI ELEMZÉS SZEKCIÓ (Érintetlenül, de prémium stílusillesztéssel) */}
      <div className="mt-8 mb-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-950 dark:to-indigo-950/20 border border-blue-100 dark:border-indigo-950 p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-blue-500/20">
            AI
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-blue-900 dark:text-indigo-300 uppercase tracking-widest">
              Intelligens Pénzügyi Asszisztens
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
              {aiAnalysis}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-blue-100/30 dark:border-indigo-900/30 flex items-center text-[11px] text-blue-500 dark:text-indigo-400 font-medium">
          <span
            className={`flex h-2 w-2 rounded-full mr-2 transform-gpu ${
              isRateLimited
                ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] animate-pulse"
                : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse"
            }`}
          />
          {isRateLimited
            ? "Gemini API korlát elérve – ideiglenesen offline"
            : "Élő adatok alapján elemezve a Gemini által"}
        </div>
      </div>

      {/* ÚJ ŰRLAP KOMPONENS */}
      <div className="mb-8">
        <AddTransactionForm />
      </div>

      {/* TRANZAKCIÓK TÁBLÁZAT */}
      <TransactionTable initialTransactions={safeTransactions} />
    </div>
  );
}
