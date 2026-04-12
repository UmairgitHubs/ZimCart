"use client";

import React, { useMemo, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Users,
  Loader2,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import dynamic from "next/dynamic";
import { AnalyticsOverview } from "@/components/dashboard/analytics/AnalyticsOverview";
import { useQueryClient } from "@tanstack/react-query";
import { useAnalyticsInsights } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

const AnalyticsCharts = dynamic(
  () => import("@/components/dashboard/analytics/AnalyticsCharts").then((mod) => mod.AnalyticsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-50/50 rounded-[40px] border border-slate-100 h-[450px] animate-pulse flex flex-col items-center justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading analytics…</p>
        </div>
        <div className="bg-slate-50/50 rounded-[40px] border border-slate-100 h-[400px] animate-pulse flex flex-col items-center justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading segments…</p>
        </div>
      </div>
    ),
  }
);

const TIME_RANGES = ["7 Days", "30 Days", "This Quarter", "Year to Date"] as const;

const RANGE_TO_API: Record<(typeof TIME_RANGES)[number], string> = {
  "7 Days": "7d",
  "30 Days": "30d",
  "This Quarter": "quarter",
  "Year to Date": "ytd",
};

const RANGE_LABEL: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  quarter: "Calendar quarter to date",
  ytd: "Year to date",
};

function formatMoney(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function AnalyticsPage() {
  const [activeDateRange, setActiveDateRange] = useState<(typeof TIME_RANGES)[number]>("Year to Date");
  const queryClient = useQueryClient();

  const apiRange = RANGE_TO_API[activeDateRange] ?? "ytd";
  const { data, isLoading, error, isFetching, refetch } = useAnalyticsInsights(apiRange, null);

  const rangeSubtitle = RANGE_LABEL[data?.range ?? apiRange] ?? "Selected range";

  const categoryForCharts = useMemo(() => {
    const rows = data?.categoryPerformance ?? [];
    if (rows.length === 0) return [{ name: "—", sales: 0, revenue: 0, percentage: 0 }];
    return rows;
  }, [data?.categoryPerformance]);

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["analytics-insights"] });
    void refetch();
  };

  const summary = data?.summary;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Revenue, orders, categories, and top sellers from your live order ledger (non-cancelled revenue where noted).
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-full overflow-x-auto no-scrollbar shrink-0">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveDateRange(range)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                  activeDateRange === range ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 group disabled:opacity-70"
            >
              <RefreshCw className={cn("w-4 h-4 transition-transform group-active:rotate-180", isFetching && "animate-spin")} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      {isLoading && !data && (
        <div className="flex items-center gap-3 text-slate-500 py-12">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold">Loading analytics…</span>
        </div>
      )}

      {summary && (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="relative group">
              <StatCard
                label="Total revenue"
                value={formatMoney(summary.totalRevenue)}
                icon={CreditCard}
                color="text-emerald-600"
                bgColor="bg-emerald-50/50"
              />
              <div
                className={cn(
                  "absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                  summary.revenueGrowth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}
              >
                {summary.revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {summary.revenueGrowth >= 0 ? "+" : ""}
                  {summary.revenueGrowth}%
                </span>
              </div>
            </div>

            <div className="relative group">
              <StatCard
                label="Total orders"
                value={summary.totalOrders.toLocaleString()}
                icon={ShoppingCart}
                color="text-blue-600"
                bgColor="bg-blue-50/50"
              />
              <div
                className={cn(
                  "absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                  summary.ordersGrowth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}
              >
                {summary.ordersGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {summary.ordersGrowth >= 0 ? "+" : ""}
                  {summary.ordersGrowth}%
                </span>
              </div>
            </div>

            <div className="relative group">
              <StatCard
                label="Avg. order value"
                value={`$${summary.averageOrderValue.toFixed(2)}`}
                icon={TrendingUp}
                color="text-indigo-600"
                bgColor="bg-indigo-50/50"
              />
              <div
                className={cn(
                  "absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                  summary.aovGrowth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}
              >
                {summary.aovGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {summary.aovGrowth >= 0 ? "+" : ""}
                  {summary.aovGrowth}%
                </span>
              </div>
            </div>

            <div className="relative group">
              <StatCard
                label="Fulfillment rate"
                value={`${summary.conversionRate}%`}
                icon={Users}
                color="text-amber-600"
                bgColor="bg-amber-50/50"
              />
              <div
                className={cn(
                  "absolute top-6 right-6 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                  summary.conversionGrowth >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                )}
              >
                {summary.conversionGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span>
                  {summary.conversionGrowth >= 0 ? "+" : ""}
                  {summary.conversionGrowth}%
                </span>
              </div>
            </div>
          </section>

          <section>
            <AnalyticsCharts
              revenueData={data?.revenueTimeline ?? []}
              categoryData={categoryForCharts}
              rangeSubtitle={rangeSubtitle}
            />

            <AnalyticsOverview topProducts={data?.topProducts ?? []} regionStats={data?.regionStats ?? []} />
          </section>
        </>
      )}
    </div>
  );
}
