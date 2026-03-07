"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function StatCard({ label, value, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-[28px] md:rounded-3xl shadow-sm border border-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-5 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] overflow-hidden">
      <div className={`${bgColor} p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 md:w-7 md:h-7 ${color}`} />
      </div>
      <div className="min-w-0 w-full overflow-hidden">
        <p className="text-[10px] md:text-sm font-bold md:font-semibold text-slate-400 mb-0.5 md:mb-1 uppercase tracking-wider md:normal-case truncate">
          {label}
        </p>
        <h3 className="text-base sm:text-lg md:text-lg xl:text-xl font-black text-slate-800 break-words leading-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}
