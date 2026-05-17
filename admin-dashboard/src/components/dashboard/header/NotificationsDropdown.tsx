"use client";

import React from "react";
import { CheckCircle, Clock, ShoppingBag, AlertCircle, Package, X, Loader2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/services/analytics.service";

function activityIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("payment")) return <DollarSign className="w-4 h-4 text-blue-500" />;
  if (t.includes("stock")) return <AlertCircle className="w-4 h-4 text-orange-500" />;
  if (t.includes("rider")) return <Package className="w-4 h-4 text-blue-500" />;
  if (t.includes("order")) return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
  return <CheckCircle className="w-4 h-4 text-slate-500" />;
}

export function NotificationsDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["analytics-activity"],
    queryFn: () => analyticsApi.getRecentActivity(),
    enabled: isOpen,
    staleTime: 60_000,
  });

  const alertCount = activities.filter((a) => a.title.toLowerCase().includes("stock")).length;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/5 backdrop-blur-[2px] z-[55] md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:mt-3 w-auto md:w-[420px] bg-white/95 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 transform-gpu z-[60]",
          "hover:shadow-blue-500/5 transition-shadow"
        )}
      >
        <div className="p-6 flex items-center justify-between bg-gradient-to-br from-slate-50/50 to-white border-b border-slate-100/80">
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 tracking-tight">Activity Feed</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
              {alertCount > 0 ? `${alertCount} stock alert${alertCount === 1 ? "" : "s"}` : "Live from orders & inventory"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 outline-none"
              title="Mark all as read"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[440px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-slate-400 font-medium text-center py-12">No recent activity yet.</p>
          ) : (
            activities.map((notif, idx) => (
              <div
                key={`${notif.title}-${idx}`}
                className={cn(
                  "p-5 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer border-b border-slate-100/50 last:border-0 group/notif",
                  idx < 2 && "bg-blue-50/10"
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover/notif:scale-105 transition-transform duration-300">
                  {activityIcon(notif.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 tracking-tight group-hover/notif:text-blue-600 transition-colors">
                    {notif.title}
                  </p>
                  <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.subtitle}</p>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{notif.time}</span>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="flex flex-col justify-start pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/10 animate-pulse" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-5 text-center border-t border-slate-100/80 bg-slate-50/30">
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest hover:underline hover:underline-offset-8 decoration-2 transition-all outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
