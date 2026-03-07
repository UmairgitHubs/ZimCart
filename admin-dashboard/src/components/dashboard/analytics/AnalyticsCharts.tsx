"use client";

import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell
} from "recharts";
import { RevenueDataPoint, CategoryPerformance } from "@/types/analytics";

interface AnalyticsChartsProps {
  revenueData: RevenueDataPoint[];
  categoryData: CategoryPerformance[];
}

export function AnalyticsCharts({ revenueData, categoryData }: AnalyticsChartsProps) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  const CustomTooltipArea = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-2xl">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label} 2026</p>
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[13px] font-black text-slate-800">Revenue: ${payload[0].value.toLocaleString()}</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-[13px] font-black text-slate-800">Orders: {payload[1].value.toLocaleString()}</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-2xl">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-black text-slate-800">${payload[0].value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Over Time Chart */}
      <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm group">
        <div className="flex items-center justify-between mb-8">
          <div>
             <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue & Orders</h3>
             <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Year to Date Performance</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Revenue</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Orders</span>
             </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
                dy={10}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                tickFormatter={(value) => `$${value / 1000}k`}
                dx={-10}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                dx={10}
              />
              <Tooltip content={<CustomTooltipArea />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2, strokeDasharray: '4 4' }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance Chart */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm group">
         <div className="mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Category Distribution</h3>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Revenue by Segment</p>
         </div>

         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} 
                  width={100}
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltipBar />} />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]} barSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
