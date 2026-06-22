import { GoogleGenerativeAI } from "@google/generative-ai";

interface Transaction {
  id: string;
  client: string;
  amount: string | number;
  status: string;
  date: string;
}

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
  let aiAnalysis = "The AI assistant is evaluating the ledger architecture...";
  let isRateLimited = false;

  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Serialize ledger subset into structural text for context window processing
    const transactionSummary = safeTransactions
      .map((tx) => `- ${tx.client}: ${tx.amount} (${tx.status}, ${tx.date})`)
      .join("\n");

    const prompt = `
      You are a senior B2B SaaS financial analyst and strategist. Provide an executive summary based on the following real-time data:
      - Current MRR: $${currentMRR.toLocaleString("en-US")}
      - Active Subscriptions: ${currentMonthCount}
      - Churn Rate: ${globalChurnRate}%

      Recent Transaction Ledger:
      ${transactionSummary}

      Task:
      Write a highly professional, dense, 2-3 sentence financial assessment or actionable strategic recommendation regarding the company's current performance, runway, or growth vectors.
      
      Constraints:
      - Respond strictly in professional English.
      - Output plain text only. Do not include any Markdown, bolding, bullet points, or special formatting characters.
    `;

    const response = await model.generateContent(prompt);
    aiAnalysis = response.response.text().trim();
  } catch (error) {
    console.error("Gemini API infrastructure execution error:", error);
    isRateLimited = true;
    aiAnalysis = "The intelligent assistant is currently rate-limited. Please trigger a refresh sequence shortly.";
  }

  return { aiAnalysis, isRateLimited };
}