"use client";

import React from "react";
import { ShoppingBag, TrendingUp, AlertTriangle, Box } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";
import { RightPanel } from "@/components/dashboard/RightPanel";

export default function DashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column: Stats and Charts */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
            <div className="flex gap-2 md:gap-3">
              <button className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] md:text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                Analytics Report
              </button>
              <button className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-emerald-600 rounded-2xl text-[10px] md:text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-nowrap">
                <Box className="w-3.5 h-3.5 md:w-4 h-4" />
                + Add Product
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              label="Total Orders" 
              value="1,284" 
              icon={ShoppingBag} 
              color="text-emerald-600" 
              bgColor="bg-emerald-50" 
            />
            <StatCard 
              label="Gross Revenue" 
              value="$12,850" 
              icon={TrendingUp} 
              color="text-blue-600" 
              bgColor="bg-blue-50" 
            />
            <StatCard 
              label="Low Stock Items" 
              value="24" 
              icon={AlertTriangle} 
              color="text-amber-600" 
              bgColor="bg-amber-50" 
            />
          </div>

          {/* Main Chart */}
          <OverviewChart />

          {/* Bottom Charts */}
          <PerformanceCharts />
        </div>

        {/* Right Column: Calendar and Activity */}
        <RightPanel />
      </div>
    </div>
  );
}
