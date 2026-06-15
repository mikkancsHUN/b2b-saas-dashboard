import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Definiáljuk a tranzakció pontos TypeScript szerkezetét
interface Transaction {
  id: string; // vagy number, amilyen az adatbázisodban
  client: string;
  amount: number;
  status: string;
  date: string;
  // ide jöhet még bármi, ami a Supabase tábládban van, pl. type: string;
}

// 2. Beillesztjük a Transaction típust az input interface-be
interface AiAnalysisInput {
  currentMRR: number;
  currentMonthCount: number;
  globalChurnRate: string;
  safeTransactions: Transaction[];
}

export async function getAiFinancialAnalysis({
  currentMRR,
  currentMonthCount,
  globalChurnRate,
  safeTransactions
}: AiAnalysisInput) {
  let aiAnalysis = "Az AI asszisztens épp elemzi az adatokat";
  let isRateLimited = false;

  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Most már a VS Code pontosan tudja, hogy a 'tx' rendelkezik client, amount, status és date mezőkkel!
    const transactionSummary = safeTransactions
      .map((tx) => `- ${tx.client}: ${tx.amount} (${tx.status}, ${tx.date})`)
      .join("\n");

    const prompt = `
      Légy egy profi B2B SaaS pénzügyi tanácsadó. Elemezd a következő élő adatokat:
      Havi bevétel: $${currentMRR.toLocaleString("en-US")}
      Aktív felhasználók: ${currentMonthCount}
      Lemorzsolódás: ${globalChurnRate}%

      Részletes tranzakciók:
      ${transactionSummary}

      Írj egy rövid, maximum 2-3 mondatos, tűpontos és professzionális magyar nyelvű elemzést vagy javaslatot a cég helyzetéről! 
      Nyers szöveget adj vissza, ne használj semmilyen markdown formázást.
    `;

    const response = await model.generateContent(prompt);
    aiAnalysis = response.response.text();
  } catch (error) {
    console.error("Gemini hiba az aiService-ben:", error);
    isRateLimited = true;
    aiAnalysis = "Az intelligens asszisztens jelenleg pihen (Rate Limit elérve). Frissítsd az oldalt egy kicsit később!";
  }

  return { aiAnalysis, isRateLimited };
}