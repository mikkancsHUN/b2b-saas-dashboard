import { GoogleGenerativeAI } from '@google/generative-ai';
import RevenueChart from './RevenueChart';
import ThemeToggle from './ThemeToggle';
import TransactionTable from './TransactionTable';
import { supabase } from '@/lib/supabase';
import AddTransactionForm from './AddTransactionForm';
import UsageChart from './UsageChart';

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


// Segédfüggvény a tranzakciók hónapok szerinti csoportosításához
// Segédfüggvény a tranzakciók hónapok szerinti csoportosításához
function generateChartData(transactions: TransactionData[]): ChartDataPoint[] {
  const monthlyData: { 
    [key: string]: { 
      month: string; 
      successful: number; pending: number; failed: number; txCount: number; 
      successCount: number; pendingCount: number; failedCount: number; // 💡 Új számlálók
    } 
  } = {
    '01': { month: 'Jan', successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    '02': { month: 'Feb', successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    '03': { month: 'Már', successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    '04': { month: 'Ápr', successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    '05': { month: 'Máj', successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    '06': { month: 'Jún', successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
  };

  transactions.forEach(tx => {
    if (!tx.date) return;
    const monthKey = tx.date.split('-')[1]; 
    
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].txCount += 1;

      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

      // 🔥 Itt gyűjtjük az összeget ÉS a darabszámot is egyszerre!
      if (tx.status === 'Sikeres') {
        monthlyData[monthKey].successful += amount;
        monthlyData[monthKey].successCount += 1;
      } else if (tx.status === 'Függőben') {
        monthlyData[monthKey].pending += amount;
        monthlyData[monthKey].pendingCount += 1;
      } else if (tx.status === 'Meghiúsult') {
        monthlyData[monthKey].failed += amount;
        monthlyData[monthKey].failedCount += 1;
      }
    }
  });

  return Object.keys(monthlyData)
    .sort()
    .map(key => ({
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
  const successfulTx = transactions.filter(tx => tx.status === 'Sikeres' && tx.date);
  
  // Összes sikeres bevétel
  const totalRevenue = successfulTx.reduce((sum, tx) => {
    const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(cleanAmount) ? 0 : cleanAmount);
  }, 0);

  const totalSuccessCount = successfulTx.length;
  const totalFailedCount = transactions.filter(tx => tx.status === 'Meghiúsult').length;
  const totalPendingCount = transactions.filter(tx => tx.status === 'Függőben').length;

  // 🔥 LÁTVÁNYOS BLIZZARD-BIZTOS JAVÍTÁS: 
  // Mindenkori összes egyedi cég kigyűjtése a valós 'client' mező alapján, dátumtól függetlenül!
  const globalUniqueCustomers = new Set<string>();
  transactions.forEach(tx => {
    if (tx.client && tx.client.trim() !== '') {
      globalUniqueCustomers.add(tx.client.trim());
    }
  });

  if (transactions.length === 0) {
    return { 
      currentMRR: 0, percentageChange: 0, isPositive: true, totalRevenue: 0,
      successTx: { current: 0, total: 0, change: 0, isPositive: true },
      flowTx: { current: 0, total: 0, change: 0, isPositive: true },
      pending: { current: 0, total: 0, change: 0, isPositive: true },
      failed: { current: 0, total: 0, change: 0, isPositive: true },
      uniqueCustomers: { currentMonthCount: 0, totalAllTimeCount: 0, changeText: '0% változás', isPositive: true }
    };
  }

  // Dátumkezelés
  const dates = transactions.filter(tx => tx.date).map(tx => new Date(tx.date || ""));
  const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  
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

  const currentMonthCustomersSet = new Set<string>();
  const prevMonthCustomersSet = new Set<string>();

  transactions.forEach(tx => {
    if (!tx.date) return;
    const txDate = new Date(tx.date);
    if (isNaN(txDate.getTime())) return;

    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();
    
    // Havi tranzakció folyamat számlálása
    if (txYear === currentYear && txMonth === currentMonth) {
      currentMonthFlowCount++;
    } else if (txYear === prevYear && txMonth === prevMonth) {
      prevMonthFlowCount++;
    }

    // 👥 HAVI BLIZZARD SZŰRŐ: Havi egyedi ügyfelek gyűjtése a valós 'client' mezővel
    if (tx.client && tx.client.trim() !== '') {
      const cleanClient = tx.client.trim();
      if (txYear === currentYear && txMonth === currentMonth) {
        currentMonthCustomersSet.add(cleanClient);
      } else if (txYear === prevYear && txMonth === prevMonth) {
        prevMonthCustomersSet.add(cleanClient);
      }
    }

    // Sikeresek és MRR
    if (tx.status === 'Sikeres') {
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

      if (txYear === currentYear && txMonth === currentMonth) {
        currentMonthTotal += amount;
        currentMonthSuccess++;
      } else if (txYear === prevYear && txMonth === prevMonth) {
        prevMonthTotal += amount;
        prevMonthSuccess++;
      }
    }
    
    // Függőben lévők
    if (tx.status === 'Függőben') {
      if (txYear === currentYear && txMonth === currentMonth) currentMonthPending++;
      else if (txYear === prevYear && txMonth === prevMonth) prevMonthPending++;
    }
    
    // Meghiúsultak
    if (tx.status === 'Meghiúsult') {
      if (txYear === currentYear && txMonth === currentMonth) currentMonthFailed++;
      else if (txYear === prevYear && txMonth === prevMonth) prevMonthFailed++;
    }
  });

  const getChange = (current: number, prev: number) => {
    if (prev > 0) {
      const change = ((current - prev) / prev) * 100;
      return { change: Math.round(Math.abs(change)), isPositive: change >= 0 };
    }
    return { change: current > 0 ? 100 : 0, isPositive: true };
  };

  const mrrChange = getChange(currentMonthTotal, prevMonthTotal);
  const successChange = getChange(currentMonthSuccess, prevMonthSuccess);
  const flowChange = getChange(currentMonthFlowCount, prevMonthFlowCount);
  const pendingChange = getChange(currentMonthPending, prevMonthPending);
  const failedChange = getChange(currentMonthFailed, prevMonthFailed);
  const customerChange = getChange(currentMonthCustomersSet.size, prevMonthCustomersSet.size);

  return {
    currentMRR: currentMonthTotal,
    percentageChange: mrrChange.change,
    isPositive: mrrChange.isPositive,
    totalRevenue,
    successTx: {
      current: currentMonthSuccess,
      total: totalSuccessCount,
      change: successChange.change,
      isPositive: successChange.isPositive
    },
    flowTx: {
      current: currentMonthFlowCount,
      total: transactions.length,
      change: flowChange.change,
      isPositive: flowChange.isPositive
    },
    pending: {
      current: currentMonthPending,
      total: totalPendingCount,
      change: pendingChange.change,
      isPositive: pendingChange.isPositive
    },
    failed: {
      current: currentMonthFailed,
      total: totalFailedCount,
      change: failedChange.change,
      isPositive: failedChange.isPositive
    },
    uniqueCustomers: {
      currentMonthCount: currentMonthCustomersSet.size,
      totalAllTimeCount: globalUniqueCustomers.size, // 💡 Ez most már kőkeményen 10 lesz!
      changeText: `${customerChange.isPositive ? '+' : '-'}${customerChange.change}%`,
      isPositive: customerChange.isPositive
    }
  };
}


export default async function DashboardPage() {
  // Ez a mi fiktív cégünk "adatbázisa"
  // ÉLŐ ADATLEKÉRÉS A FELHŐBŐL:
  // Lekérjük az összes oszlopot (*) a 'transactions' táblából, és a legújabbakat tesszük előre
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

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
    .filter(tx => tx.status === 'Sikeres') // Csak a sikereseket vesszük figyelembe
    .reduce((sum, tx) => {
      // Megtisztítjuk a szöveget: kitöröljük a '$' jelet és a vesszőket, majd számmá alakítjuk
      // Pl: "$1,200" -> "1200" -> 1200
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(cleanAmount) ? 0 : cleanAmount);
    }, 0);

  // Formázzuk a kapott összeget, hogy újra szép dollár formátuma legyen (pl: $1,550)
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalRevenue);


  // EGYEDI ÜGYFELEK KISZÁMÍTÁSA
  // Kigyűjtjük az összes tranzakcióból a kliensek neveit egy egyedi halmazba (Set)
  const uniqueClients = new Set(safeTransactions.map(tx => tx.client));
  // Megszámoljuk, hány elem maradt a halmazban
  const activeUsersCount = uniqueClients.size;

  // LEMORZSOLÓDÁSI ARÁNY (CHURN) KISZÁMÍTÁSA
  // Megszámoljuk a meghiúsult tranzakciókat
  const failedTransactions = safeTransactions.filter(tx => tx.status === 'Meghiúsult').length;
  // Kiszámoljuk a százalékot az összes tranzakcióhoz képest
  // Ha még nincs tranzakció, akkor 0%, különben (meghiúsult / összes) * 100
  const churnRate = safeTransactions.length > 0
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
      positive: true 
    },
    users: { title: "Aktív Ügyfelek", amount: activeUsersCount.toString(), change: `Összesen ${safeTransactions.length} tranzakció`, positive: true },
    churn: { title: "Sikertelen Fizetések (Churn)", amount: formattedChurn, change: `${failedTransactions} meghiúsult tranzakció`, positive: churnRate < 15 }
    // Ha a churn 15% felett van, akkor piros jelzést kap, ha alatta, akkor zöld (jó)
  };

  
  // AZ AI LOGIKA – GOLYÓÁLLÓ VERZIÓ RATE LIMIT KEZELÉSSEL
  let aiAnalysis = "Az AI asszisztens épp elemzi az adatokat";

  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Részletes tranzakciós lista összeállítása a nyers adatokból
    const transactionSummary = safeTransactions.map(tx => `- ${tx.client}: ${tx.amount} (${tx.status}, ${tx.date})`).join('\n');

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
    // Ha elértük a limitet, vagy bármi hiba van, nem omlik össze az app, ezt fogja kiírni:
    aiAnalysis = "Az intelligens asszisztens jelenleg pihen (Rate Limit elérve). Frissítsd az oldalt egy kicsit később!"
  }


  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      {/* Címsor */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pénzügyi Irányítópult</h1>
        <ThemeToggle />
      </div>

      {/* A RÁCS (GRID) */}
      {/* 🚀 SZIMMETRIKUS TŐZSDEI RÁCS (GRID) - 4 OSZLOPOS ELRENDEZÉS */}
      {/* 🚀 ELIT SAAS TŐZSDEI RÁCS (2x4-ES SZIMMETRIA, SÖTÉT MÓDÚ GRAFIT SZÍNNEL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* ================= ELSŐ SOR: FŐ METRIKÁK ================= */}
        
        {/* 1. KÁRTYA: DINAMIKUS MRR */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MRR (Havi Ismétlődő Bevétel)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${mrrMetrics.currentMRR.toLocaleString('en-US')}
            </span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              mrrMetrics.isPositive 
                ? 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400' 
                : 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400'
            }`}>
              {mrrMetrics.isPositive ? '+' : '-'}{mrrMetrics.percentageChange}%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">az előző hónaphoz képest</p>
        </div>

        {/* 2. KÁRTYA: ÖSSZES EDDIGI BEVÉTEL */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes Bevétel (Total Revenue)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${mrrMetrics.totalRevenue.toLocaleString('en-US')}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400">
              Mióta létezik
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">az összes sikeres tranzakció összege</p>
        </div>

        {/* 3. KÁRTYA: VALÓDI EGYEDI ÜGYFELEK (Dinamikus szűréssel) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktív Ügyfelek (Cégek)</p>
          
          {/* Nagy szám: Csak a jelenlegi hónap */}
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {mrrMetrics.uniqueCustomers.currentMonthCount} cég
            </p>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              mrrMetrics.uniqueCustomers.isPositive
                ? "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400"
                : "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400"
            }`}>
              {mrrMetrics.uniqueCustomers.changeText.split(' ')[0]} {/* Csak a százalék, pl: +10% */}
            </span>
          </div>
          
          <p className="text-xs text-gray-400 mt-1">a jelenlegi hónapban</p>
          
          {/* Elválasztó vonal és a mindenkori összesen sor */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Eddigi összes partner:</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
              {mrrMetrics.uniqueCustomers.totalAllTimeCount} egyedi cég
            </span>
          </div>
        </div>

        {/* 4. KÁRTYA: STATIKUS CHURN (Eredeti) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stats.churn.title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.churn.amount}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md mt-2 inline-block ${
            stats.churn.positive 
              ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30" 
              : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
          }`}>
            {stats.churn.change} az előző hónaphoz képest
          </span>
        </div>


        {/* ================= MÁSODIK SOR: 3-CSÍKOS TŐZSDEI TERMINÁL PANELKÉK ================= */}

        {/* 5. KÁRTYA: ÖSSZES TRANZAKCIÓ ÁRAMLÁSA (DÁTUM BONTÁSBAN) */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            🔄 Tranzakciók Áramlása (Összes)
          </p>
          <div className="space-y-1.5">
            <span className="text-xs font-medium px-2.5 py-1.5 rounded-md block text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30">
              • Jelenlegi hónap: {mrrMetrics.flowTx.current} művelet
            </span>
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.flowTx.isPositive 
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30" 
                : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
            }`}>
              • {mrrMetrics.flowTx.isPositive ? '+' : '-'}{mrrMetrics.flowTx.change}% mozgás az előzőhöz képest
            </span>
            <span className="text-xs font-medium px-2.5 py-1.5 rounded-md block text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30">
              • Mindenkori összes indított: {mrrMetrics.flowTx.total} tranzakció
            </span>
          </div>
        </div>

        {/* 6. ÚJ KÁRTYA: SIKERES TRANZAKCIÓK TRENDJE */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">
            ✓ Sikeres Tranzakciók
          </p>
          <div className="space-y-1.5">
            <span className="text-xs font-medium px-2.5 py-1.5 rounded-md block text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30">
              • Jelenlegi hónap: {mrrMetrics.successTx.current} db
            </span>
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.successTx.isPositive 
                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30" 
                : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
            }`}>
              • {mrrMetrics.successTx.isPositive ? '+' : '-'}{mrrMetrics.successTx.change}% változás az előzőhöz képest
            </span>
            <span className="text-xs font-medium px-2.5 py-1.5 rounded-md block text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30">
              • Mindenkori összesen: {mrrMetrics.successTx.total} db
            </span>
          </div>
        </div>

        {/* 7. KÁRTYA: FÜGGŐBEN LÉVŐ OSZLOP */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">
            ⏳ Függőben lévő tranzakciók
          </p>
          <div className="space-y-1.5">
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.pending.current > 0 
                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" 
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            }`}>
              • Jelenlegi hónap: {mrrMetrics.pending.current} db
            </span>
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.pending.current > 0 
                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" 
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            }`}>
              • {mrrMetrics.pending.current > 0 ? `+${mrrMetrics.pending.change}% felhalmozódás` : "0% változás"} az előzőhöz képest
            </span>
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.pending.total > 0 
                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" 
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            }`}>
              • Mindenkori összesen: {mrrMetrics.pending.total} db
            </span>
          </div>
        </div>

        {/* 8. KÁRTYA: MEGHÍÚSULT OSZLOP */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">
            ⚠️ Meghiúsult tranzakciók
          </p>
          <div className="space-y-1.5">
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.failed.current > 0 
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30" 
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            }`}>
              • Jelenlegi hónap: {mrrMetrics.failed.current} db
            </span>
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.failed.current > 0 
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30" 
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            }`}>
              • {mrrMetrics.failed.current > 0 ? `+${mrrMetrics.failed.change}% hibanövekedés` : "0% hibaarány"} az előzőhöz képest
            </span>
            <span className={`text-xs font-medium px-2.5 py-1.5 rounded-md block ${
              mrrMetrics.failed.total > 0 
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30" 
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            }`}>
              • Mindenkori összesen: {mrrMetrics.failed.total} db
            </span>
          </div>
        </div>

      </div>

      {/* KÖZÖS DIAGRAM RÁCS: Desktopon egymás mellett, mobilon egymás alatt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 items-stretch">
        <RevenueChart chartData={liveChartData} />
        <UsageChart chartData={liveChartData} />
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
          Élő adatok alapján elemezve a Gemini által
        </div>
      </div>

      {/* ÚJŰRLAP KOMPONENS */}
      <AddTransactionForm />

      {/* TRANZAKCIÓK TÁBLÁZAT */}
      <TransactionTable initialTransactions={safeTransactions} />
    </div>
  );
}