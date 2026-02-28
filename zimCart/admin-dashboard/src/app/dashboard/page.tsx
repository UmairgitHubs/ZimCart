"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, TrendingUp, AlertTriangle, Download, Loader2, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";
import { RightPanel } from "@/components/dashboard/RightPanel";

export default function DashboardPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    // Simulate generating and downloading report
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      
      // Reset success state after 2.5 seconds
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 2500);
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column: Stats and Charts */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={handleDownload}
                disabled={isDownloading || downloadSuccess}
                className={`flex-1 sm:flex-none px-4 md:px-5 py-2.5 rounded-xl text-[12px] md:text-[13px] font-bold text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 text-nowrap min-w-[160px] group ${
                  downloadSuccess 
                    ? 'bg-emerald-500 hover:bg-emerald-600 cursor-default' 
                    : isDownloading
                      ? 'bg-slate-800 cursor-not-allowed opacity-90'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                    Generating...
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-in zoom-in" />
                    Generated
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    Analytics Report
                  </>
                )}
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
