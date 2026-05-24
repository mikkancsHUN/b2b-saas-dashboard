import { GoogleGenerativeAI } from '@google/generative-ai';
import RevenueChart from './RevenueChart';
import ThemeToggle from './ThemeToggle';
import TransactionTable from './TransactionTable';
import { supabase } from '@/lib/supabase';
import AddTransactionForm from './AddTransactionForm';

export default async function DashboardPage() {
  // Ez a mi fiktív cégünk "adatbázisa"
  // 🔥 ÉLŐ ADATLEKÉRÉS A FELHŐBŐL:
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


  // 🔥 ÚJ: EGYEDI ÜGYFELEK KISZÁMÍTÁSA
  // Kigyűjtjük az összes tranzakcióból a kliensek neveit egy egyedi halmazba (Set)
  const uniqueClients = new Set(safeTransactions.map(tx => tx.client));
  // Megszámoljuk, hány elem maradt a halmazban
  const activeUsersCount = uniqueClients.size;

  // 🔥 ÚJ: LEMORZSOLÓDÁSI ARÁNY (CHURN) KISZÁMÍTÁSA
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

  
  // 🔥 AZ AI LOGIKA – GOLYÓÁLLÓ VERZIÓ RATE LIMIT KEZELÉSSEL
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

      {/* ÚJ GRAFIKON SZEKCIÓ */}
      <RevenueChart />

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