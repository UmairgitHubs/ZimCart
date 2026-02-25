"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  Download, 
  FileText, 
  RefreshCw,
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Users
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import dynamic from "next/dynamic";
import { AnalyticsOverview } from "@/components/dashboard/analytics/AnalyticsOverview";

const AnalyticsCharts = dynamic(
  () => import("@/components/dashboard/analytics/AnalyticsCharts").then(mod => mod.AnalyticsCharts),
  { 
    ssr: false, 
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-50/50 rounded-[40px] border border-slate-100 h-[450px] animate-pulse flex flex-col items-center justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Analytics Engine...</p>
        </div>
        <div className="bg-slate-50/50 rounded-[40px] border border-slate-100 h-[400px] animate-pulse flex flex-col items-center justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendering Segments...</p>
        </div>
      </div>
    )
  }
);
import { 
  MOCK_REVENUE_TIMELINE, 
  MOCK_CATEGORY_PERFORMANCE, 
  MOCK_TOP_PRODUCTS, 
  MOCK_REGION_STATS, 
  MOCK_ANALYTICS_SUMMARY 
} from "@/constants/analytics";
import { cn } from "@/lib/utils";

const TIME_RANGES = ["7 Days", "30 Days", "This Quarter", "Year to Date"];

export default function AnalyticsPage() {
  const [activeDateRange, setActiveDateRange] = useState("Year to Date");

  const handleRefresh = () => {
    console.log("Refreshing analytics data...");
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Analytics 
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Deep dive tracking into revenue, customer behavior, and sales performance.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-full overflow-x-auto no-scrollbar shrink-0">
             {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveDateRange(range)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                    activeDateRange === range 
                     ? "bg-white text-slate-800 shadow-sm" 
                     : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                  )}
                >
                   {range}
                </button>
             ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center bg-white border border-slate-100 rounded-2xl p-1.5 gap-1 shadow-sm">
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-[12px] font-bold text-slate-600 transition-all active:scale-95">
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSV</span>
              </button>
              <div className="w-[1px] h-4 bg-slate-100"></div>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-[12px] font-bold text-slate-600 transition-all active:scale-95">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>PDF</span>
              </button>
            </div>

            <button 
              onClick={handleRefresh}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 group"
            >
              <RefreshCw className="w-4 h-4 transition-transform group-active:rotate-180" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="relative group">
           <StatCard 
             label="Total Revenue" 
             value={`$${(MOCK_ANALYTICS_SUMMARY.totalRevenue / 1000).toFixed(1)}k`} 
             icon={CreditCard} 
             color="text-emerald-600" 
             bgColor="bg-emerald-50/50" 
           />
           <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+{MOCK_ANALYTICS_SUMMARY.revenueGrowth}%</span>
           </div>
        </div>

        <div className="relative group">
           <StatCard 
             label="Total Orders" 
             value={MOCK_ANALYTICS_SUMMARY.totalOrders.toLocaleString()} 
             icon={ShoppingCart} 
             color="text-blue-600" 
             bgColor="bg-blue-50/50" 
           />
           <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+{MOCK_ANALYTICS_SUMMARY.ordersGrowth}%</span>
           </div>
        </div>

        <div className="relative group">
           <StatCard 
             label="Avg. Order Value" 
             value={`$${MOCK_ANALYTICS_SUMMARY.averageOrderValue.toFixed(2)}`} 
             icon={TrendingUp} 
             color="text-indigo-600" 
             bgColor="bg-indigo-50/50" 
           />
           <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+{MOCK_ANALYTICS_SUMMARY.aovGrowth}%</span>
           </div>
        </div>

        <div className="relative group">
           <StatCard 
             label="Conversion Rate" 
             value={`${MOCK_ANALYTICS_SUMMARY.conversionRate}%`} 
             icon={Users} 
             color="text-amber-600" 
             bgColor="bg-amber-50/50" 
           />
           <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
              <TrendingUp className="w-3 h-3 rotate-180 text-red-500" />
              <span>{MOCK_ANALYTICS_SUMMARY.conversionGrowth}%</span>
           </div>
        </div>
      </section>

      {/* Main Charts Area */}
      <section>
        <AnalyticsCharts 
          revenueData={MOCK_REVENUE_TIMELINE} 
          categoryData={MOCK_CATEGORY_PERFORMANCE}
        />
        
        <AnalyticsOverview 
          topProducts={MOCK_TOP_PRODUCTS}
          regionStats={MOCK_REGION_STATS}
        />
      </section>
    </div>
  );
}
