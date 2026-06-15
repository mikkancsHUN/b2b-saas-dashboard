// app/dashboard/utils.ts

export interface ChartDataPoint {
  month: string;
  successful: number;
  pending: number;
  failed: number;
  transactions: number;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
}

interface TransactionData {
  id: string;
  amount: string;
  status: string;
  date: string | null;
  client: string;
  email: string;
}

interface MonthlyMetrics {
  month: string;
  successful: number;
  pending: number;
  failed: number;
  txCount: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
}
interface MonthlyDataMap {
  [key: string]: MonthlyMetrics;
}

// Hónapok szerinti csoportosítás diagramhoz
export function generateChartData(transactions: TransactionData[]): ChartDataPoint[] {
  const monthlyData: MonthlyDataMap = {
    "01": { month: "Jan", successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    "02": { month: "Feb", successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    "03": { month: "Már", successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    "04": { month: "Ápr", successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    "05": { month: "Máj", successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
    "06": { month: "Jún", successful: 0, pending: 0, failed: 0, txCount: 0, successCount: 0, pendingCount: 0, failedCount: 0 },
  };

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const monthKey = tx.date.split("-")[1];

    if (monthlyData[monthKey]) {
      monthlyData[monthKey].txCount += 1;
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

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

  return Object.keys(monthlyData).sort().map((key) => ({
    month: monthlyData[key].month,
    successful: monthlyData[key].successful,
    pending: monthlyData[key].pending,
    failed: monthlyData[key].failed,
    transactions: monthlyData[key].txCount,
    successfulCount: monthlyData[key].successCount,
    pendingCount: monthlyData[key].pendingCount,
    failedCount: monthlyData[key].failedCount,
  }));
}

// MRR és egyéb prémium SaaS metrikák számítása
export function calculateMRRMetrics(transactions: TransactionData[]) {
  const successfulTx = transactions.filter((tx) => tx.status === "Sikeres" && tx.date);

  const totalRevenue = successfulTx.reduce((sum, tx) => {
    const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(cleanAmount) ? 0 : cleanAmount);
  }, 0);

  const totalSuccessCount = successfulTx.length;
  const totalFailedCount = transactions.filter((tx) => tx.status === "Meghiúsult").length;
  const totalPendingCount = transactions.filter((tx) => tx.status === "Függőben").length;

  const globalUniqueCustomers = new Set<string>();
  transactions.forEach((tx) => {
    if (tx.client && tx.client.trim() !== "") globalUniqueCustomers.add(tx.client.trim());
  });

  if (transactions.length === 0) {
    return {
      currentMRR: 0, percentageChange: 0, isPositive: true, totalRevenue: 0, globalChurnRate: "0.0",
      successTx: { current: 0, total: 0, change: 0, isPositive: true },
      flowTx: { current: 0, total: 0, change: 0, isPositive: true },
      pending: { current: 0, total: 0, change: 0, isPositive: true },
      failed: { current: 0, total: 0, change: 0, isPositive: true },
      uniqueCustomers: { currentMonthCount: 0, totalAllTimeCount: 0, changeText: "0% változás", isPositive: true },
    };
  }

  const dates = transactions.filter((tx) => tx.date).map((tx) => new Date(tx.date || ""));
  const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();

  const currentYear = latestDate.getFullYear();
  const currentMonth = latestDate.getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let currentMonthTotal = 0, prevMonthTotal = 0, currentMonthSuccess = 0, prevMonthSuccess = 0;
  let currentMonthPending = 0, prevMonthPending = 0, currentMonthFailed = 0, prevMonthFailed = 0;
  let currentMonthFlowCount = 0, prevMonthFlowCount = 0;

  const currentMonthCustomersSet = new Set<string>();
  const prevMonthCustomersSet = new Set<string>();

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const txDate = new Date(tx.date);
    if (isNaN(txDate.getTime())) return;

    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();

    if (txYear === currentYear && txMonth === currentMonth) currentMonthFlowCount++;
    else if (txYear === prevYear && txMonth === prevMonth) prevMonthFlowCount++;

    if (tx.status === "Sikeres") {
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

      if (txYear === currentYear && txMonth === currentMonth) {
        currentMonthTotal += amount;
        currentMonthSuccess++;
        if (tx.client && tx.client.trim() !== "") currentMonthCustomersSet.add(tx.client.trim());
      } else if (txYear === prevYear && txMonth === prevMonth) {
        prevMonthTotal += amount;
        prevMonthSuccess++;
        if (tx.client && tx.client.trim() !== "") prevMonthCustomersSet.add(tx.client.trim());
      }
    }

    if (tx.status === "Függőben") {
      if (txYear === currentYear && txMonth === currentMonth) currentMonthPending++;
      else if (txYear === prevYear && txMonth === prevMonth) prevMonthPending++;
    }

    if (tx.status === "Meghiúsult") {
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

  const totalTxCount = transactions.length;
  const globalChurnRate = totalTxCount > 0 ? ((totalFailedCount / totalTxCount) * 100).toFixed(1) : "0.0";

  return {
    currentMRR: currentMonthTotal,
    percentageChange: mrrChange.change,
    isPositive: mrrChange.isPositive,
    totalRevenue,
    globalChurnRate,
    successTx: { current: currentMonthSuccess, total: totalSuccessCount, change: successChange.change, isPositive: successChange.isPositive },
    flowTx: { current: currentMonthFlowCount, total: totalTxCount, change: flowChange.change, isPositive: flowChange.isPositive },
    pending: { current: currentMonthPending, total: totalPendingCount, change: pendingChange.change, isPositive: pendingChange.isPositive },
    failed: { current: currentMonthFailed, total: totalFailedCount, change: failedChange.change, isPositive: failedChange.isPositive },
    uniqueCustomers: {
      currentMonthCount: currentMonthCustomersSet.size,
      totalAllTimeCount: globalUniqueCustomers.size,
      changeText: `${customerChange.isPositive ? "+" : "-"}${customerChange.change}%`,
      isPositive: customerChange.isPositive,
    },
  };
}