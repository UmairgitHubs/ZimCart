"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bike, Loader2, RefreshCw } from "lucide-react";
import { FleetMapClient } from "@/components/dashboard/riders/FleetMapClient";
import { riderAdminApi } from "@/services/riderAdmin.service";

export default function FleetMapPage() {
  const { data: riders = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["riders", "live-map"],
    queryFn: () => riderAdminApi.getLiveMap(),
    refetchInterval: 15_000,
  });

  const online = riders.filter((r) => r.status !== "OFFLINE").length;
  const withGps = riders.filter((r) => r.latitude != null).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/riders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to riders
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Bike className="w-8 h-8 text-emerald-600" />
            Live fleet map
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {online} online · {withGps} sharing GPS · refreshes every 15s
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        </div>
      ) : (
        <FleetMapClient riders={riders} />
      )}

      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-500" /> On delivery
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-400" /> Offline / no GPS
        </span>
      </div>
    </div>
  );
}
