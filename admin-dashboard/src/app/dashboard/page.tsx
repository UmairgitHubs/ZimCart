"use client";

import React, { useMemo, useState } from "react";
import { ShoppingBag, TrendingUp, AlertTriangle, Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { useAnalyticsOverview } from "@/hooks/useAnalytics";

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function DashboardPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { data, isLoading, error } = useAnalyticsOverview(null);

  const handleDownload = () => {
    if (!data) return;
    setIsDownloading(true);
    setDownloadSuccess(false);
    const rows = [
      ["metric", "value"],
      ["Window", data.windowLabel],
      ["Total orders (non-cancelled)", String(data.kpis.totalOrders)],
      ["Gross revenue (non-cancelled)", String(data.kpis.grossRevenue)],
      ["Low stock SKUs (inventory <= 10)", String(data.kpis.lowStockItems)],
      ["Orders vs prior window %", String(data.kpis.ordersGrowthPct)],
      ["Revenue vs prior window %", String(data.kpis.revenueGrowthPct)],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overview-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
    setDownloadSuccess(true);
    window.setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const perf = data?.performanceLast30Days;

  const growthLine = useMemo(() => {
    if (!data) return null;
    const { ordersGrowthPct, revenueGrowthPct } = data.kpis;
    return `vs prior ${data.windowLabel.toLowerCase()}: orders ${ordersGrowthPct >= 0 ? "+" : ""}${ordersGrowthPct}%, revenue ${revenueGrowthPct >= 0 ? "+" : ""}${revenueGrowthPct}%`;
  }, [data]);

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
              {data && (
                <p className="text-xs font-semibold text-slate-500 mt-1">{data.windowLabel} · live from orders & inventory</p>
              )}
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading || downloadSuccess || !data}
                className={`flex-1 sm:flex-none px-4 md:px-5 py-2.5 rounded-xl text-[12px] md:text-[13px] font-bold text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 text-nowrap min-w-[160px] group ${
                  downloadSuccess
                    ? "bg-emerald-500 hover:bg-emerald-600 cursor-default"
                    : isDownloading
                      ? "bg-slate-800 cursor-not-allowed opacity-90"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                }`}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                    Exporting…
                  </>
                ) : downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-in zoom-in" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    Overview CSV
                  </>
                )}
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 py-16">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
              <span className="text-sm font-semibold">Loading overview metrics…</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{(error as Error).message}</span>
            </div>
          )}

          {!isLoading && data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <StatCard
                  label="Total orders"
                  value={data.kpis.totalOrders.toLocaleString()}
                  icon={ShoppingBag}
                  color="text-emerald-600"
                  bgColor="bg-emerald-50"
                />
                <StatCard
                  label="Gross revenue"
                  value={formatMoney(data.kpis.grossRevenue)}
                  icon={TrendingUp}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />
                <StatCard
                  label="Low stock SKUs"
                  value={data.kpis.lowStockItems.toLocaleString()}
                  icon={AlertTriangle}
                  color="text-amber-600"
                  bgColor="bg-amber-50"
                />
              </div>
              {growthLine && <p className="text-[11px] font-semibold text-slate-400 mb-8">{growthLine}</p>}

              <OverviewChart data={data.salesLast6Months} subtitle="Rolling 6 months (non-cancelled revenue)" />

              <PerformanceCharts
                categorySales={perf?.categorySales ?? []}
                orderStatus={perf?.orderStatus ?? []}
              />
            </>
          )}
        </div>

        <RightPanel />
      </div>
    </div>
  );
}
