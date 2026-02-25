"use client";

import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

import { SALES_OVERVIEW_DATA } from "@/constants/dashboard";

export function OverviewChart() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex flex-col h-[450px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Sales Overview</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Monthly revenue performance</p>
        </div>
        <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer">
          <option>October 2023</option>
          <option>September 2023</option>
        </select>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SALES_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#111827", 
                border: "none", 
                borderRadius: "12px", 
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
              }}
              itemStyle={{ color: "#10B981" }}
              cursor={{ stroke: "#10B981", strokeWidth: 2, strokeDasharray: "5 5" }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#10B981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
