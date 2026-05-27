'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// 🔥 Típus meghatározása itt is
interface ChartDataPoint {
  month: string;
  revenue: number;
  transactions: number;
}

interface UsageChartProps {
  chartData: ChartDataPoint[];
}

export default function UsageChart({ chartData = [] }: UsageChartProps) {
  const data = chartData;

  return (
    // 1. A KÜLSŐ DOBOZ: Teljesen normális p-6 padding, mint a többi kártyánál! A cím így tökéletesen szimmetrikus.
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors h-full flex flex-col justify-between">
      
      {/* 2. CÍM SZEKCIÓ: Semmi extra osztály nem kell rá, a szülő p-6 miatt tökéletesen áll */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tranzakciók Mennyisége</h3>
<p className="text-sm text-gray-500 dark:text-gray-400">Havi bontásban feldolgozott műveletek száma</p>
      </div>

      {/* 3. DIAGRAM SZEKCIÓ: Mobilon a -mx-6 kihúzza a széléig, px-2 hogy a számok ne lógjanak le. Laptopon (lg:) visszaáll normálra (mx-0) */}
      <div className="w-full h-[300px] -mx-6 pl-2 pr-0 lg:mx-0 lg:px-0">
        <ResponsiveContainer width="100%" height="100%">
          {/* 🔥 MÓDOSÍTVA: right: 0, így teljesen kisimul a jobb széléig! */}
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            
            <XAxis dataKey="month" className="text-xs fill-gray-500 dark:fill-gray-400" />
            <YAxis 
              className="text-xs fill-gray-500 dark:fill-gray-400" 
              domain={[0, 'dataMax + 2']} // A nulláról indul, és a legnagyobb darabszám felett hagy 2 egység helyet
              hide={false} // 💡 Kapcsoljuk vissza, hogy látszódjon: 2, 4, 6, 8, 10, 12 db!
              tickFormatter={(value) => `${value} db`} // "db" felirat a számok mögé
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderRadius: '8px',
                border: '1px solid var(--gray-700)'
              }} 
            />
            
            <Area 
              type="monotone" // Szép, lágy, lekerekített hullámvonal
              dataKey="transactions" 
              stroke="#3B82F6" 
              strokeWidth={3} // 🔥 Vastagabb, karakteresebb vonal
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}