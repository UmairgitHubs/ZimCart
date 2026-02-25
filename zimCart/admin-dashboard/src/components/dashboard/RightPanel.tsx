"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ChevronDown } from "lucide-react";
import { RECENT_ACTIVITIES } from "@/constants/dashboard";

export function RightPanel() {
  return (
    <div className="w-80 hidden xl:flex flex-col gap-8">
      {/* Calendar Card */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Inventory Schedule</h3>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">February 2026</span>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-slate-50 rounded-md text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-slate-50 rounded-md text-slate-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Simplified Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-4 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className="text-[10px] font-bold text-slate-300 uppercase">{d}</span>
          ))}
          {Array.from({ length: 28 }).map((_, i) => {
            const day = i + 1;
            const isToday = day === 25;
            const hasEvent = [10, 15, 20].includes(day);
            return (
              <div key={day} className="relative py-1 cursor-pointer group">
                <span className={`text-xs font-bold leading-none ${isToday ? 'text-emerald-600' : 'text-slate-600 group-hover:text-emerald-500'}`}>
                  {day}
                </span>
                {hasEvent && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full mt-1"></div>
                )}
                {isToday && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Task */}
      <div className="bg-emerald-600 rounded-[32px] p-6 text-white relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/70">Upcoming</p>
              <p className="text-xs font-bold underline cursor-pointer">View Schedule</p>
            </div>
          </div>
          <h4 className="text-lg font-bold leading-snug mb-2">Restock: Grocery Batch A</h4>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-white/80">
            <Clock className="w-3.5 h-3.5" />
            <span>25 February, 2026 | 10:00 AM</span>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 flex-1">
        <h3 className="font-bold text-slate-800 mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {RECENT_ACTIVITIES.map((activity, idx) => (
            <div key={idx} className="flex gap-4 group cursor-pointer">
              <div className="relative flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${activity.color} ring-4 ring-white relative z-10`}></div>
                {idx !== RECENT_ACTIVITIES.length - 1 && (
                  <div className="w-0.5 flex-1 bg-slate-100 -mb-6 mt-1 group-hover:bg-emerald-100 transition-colors"></div>
                )}
              </div>
              <div className="flex-1 -mt-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[13px] font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{activity.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{activity.time}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">{activity.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
