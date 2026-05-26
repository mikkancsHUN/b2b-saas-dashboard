'use client';

import { useState } from 'react';

export default function RevenueChart() {
  const data = [
    { month: 'Jan', revenue: 8 },
    { month: 'Feb', revenue: 9.5 },
    { month: 'Már', revenue: 11 },
    { month: 'Ápr', revenue: 10.2 },
    { month: 'Máj', revenue: 13 },
    { month: 'Jún', revenue: 15.2 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bevételi Trendek</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Az elmúlt 6 hónap növekedése</p>
        </div>
        <div className="text-right h-10">
          {hoveredIndex !== null ? (
            <div>
              <span className="text-xs text-gray-400 block">{data[hoveredIndex].month}i bevétel:</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">${data[hoveredIndex].revenue * 1000}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic leading-10">Húzd rá az egeret az oszlopokra!</span>
          )}
        </div>
      </div>

      {/* A GRAFIKON TERÜLETE (A relatív pozíció kell a háttércsíkok miatt) */}
      <div className="relative h-64 lg:h-auto lg:flex-1 mt-4 min-h-[12rem]">
        
        {/* 1. VÍZSZINTES RÁCSVONALAK (A CSÍKOK) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
          <div className="w-full border-t border-gray-100 dark:border-gray-800/50 h-0" />
        </div>

        {/* 2. AZ OSZLOPOK (Most már fixen látható Tailwind színekkel) */}
        {/* 2. AZ OSZLOPOK: Az items-end garantálja, hogy fixen az aljára üljenek le az oszlopok, bármekkora is a doboz */}
      <div className="absolute inset-0 flex justify-between items-end pt-4 px-2 gap-3">
        {data.map((item, index) => {
          const heightPercent = (item.revenue / 16) * 100;

          return (
            <div 
              key={item.month} 
              className="flex-1 flex flex-col justify-end h-full items-center group cursor-pointer z-10"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Az oszlop maga */}
              <div 
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-md transition-all duration-300 relative ${
                  hoveredIndex === index 
                    ? 'bg-indigo-600 dark:bg-indigo-500 shadow-lg' 
                    : 'bg-indigo-200 dark:bg-slate-700'
                }`}
              >
                {/* Kis lebegő buborék */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 font-bold">
                  ${item.revenue}k
                </div>
              </div>
              
              {/* Hónap felirat az oszlop alatt */}
              <span className="text-xs text-gray-400 mt-2 font-medium absolute -mb-6">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
    
    {/* Ez a kis extra alsó margó most már tökéletesen a helyén tartja a hónapokat */}
    <div className="h-6 flex-shrink-0" />
  </div>
);
}