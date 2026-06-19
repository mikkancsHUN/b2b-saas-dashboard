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

export function generateChartData(transactions: TransactionData[]): ChartDataPoint[] {
  const monthlyData: MonthlyDataMap = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();

  // Generate a rolling 6-month chronological viewport anchor
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const yearMonthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    monthlyData[yearMonthKey] = {
      month: monthNames[monthIndex],
      successful: 0,
      pending: 0,
      failed: 0,
      txCount: 0,
      successCount: 0,
      pendingCount: 0,
      failedCount: 0,
    };
  }

  // Parse transaction entities and map to respective temporal buckets
  transactions.forEach((tx) => {
    if (!tx.date) return;
    const txYearMonth = tx.date.substring(0, 7);

    if (monthlyData[txYearMonth]) {
      monthlyData[txYearMonth].txCount += 1;
      const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
      const amount = isNaN(cleanAmount) ? 0 : cleanAmount;

      // CRITICAL: Aligned with Stripe-compliant database state row values
      if (tx.status === "succeeded") {
        monthlyData[txYearMonth].successful += amount;
        monthlyData[txYearMonth].successCount += 1;
      } else if (tx.status === "pending") {
        monthlyData[txYearMonth].pending += amount;
        monthlyData[txYearMonth].pendingCount += 1;
      } else if (tx.status === "failed") {
        monthlyData[txYearMonth].failed += amount;
        monthlyData[txYearMonth].failedCount += 1;
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
      successfulCount: monthlyData[key].successCount,
      pendingCount: monthlyData[key].pendingCount,
      failedCount: monthlyData[key].failedCount,
    }));
}

export function calculateMRRMetrics(transactions: TransactionData[]) {
  // CRITICAL: Aligned with Stripe-compliant database state row values
  const successfulTx = transactions.filter((tx) => tx.status === "succeeded" && tx.date);

  const totalRevenue = successfulTx.reduce((sum, tx) => {
    const cleanAmount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(cleanAmount) ? 0 : cleanAmount);
  }, 0);

  const totalSuccessCount = successfulTx.length;
  const totalFailedCount = transactions.filter((tx) => tx.status === "failed").length;
  const totalPendingCount = transactions.filter((tx) => tx.status === "pending").length;

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
      uniqueCustomers: { currentMonthCount: 0, totalAllTimeCount: 0, changeText: "0% change", isPositive: true },
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

    // CRITICAL: Aligned with Stripe-compliant database state row values
    if (tx.status === "succeeded") {
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

    if (tx.status === "pending") {
      if (txYear === currentYear && txMonth === currentMonth) currentMonthPending++;
      else if (txYear === prevYear && txMonth === prevMonth) prevMonthPending++;
    }

    if (tx.status === "failed") {
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