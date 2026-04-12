"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

export interface CategorySalesBar {
  name: string;
  sales: number;
  orders?: number;
}

export interface OrderStatusSlice {
  name: string;
  value: number;
  color: string;
}

interface PerformanceChartsProps {
  categorySales: CategorySalesBar[];
  orderStatus: OrderStatusSlice[];
  categorySubtitle?: string;
  statusSubtitle?: string;
}

const EMPTY_CATEGORY: CategorySalesBar[] = [{ name: "—", sales: 0 }];
const EMPTY_STATUS: OrderStatusSlice[] = [{ name: "No orders", value: 1, color: "#E2E8F0" }];

export function PerformanceCharts({
  categorySales,
  orderStatus,
  categorySubtitle = "Last 30 days, non-cancelled revenue",
  statusSubtitle = "Last 30 days, all statuses",
}: PerformanceChartsProps) {
  const barData = categorySales.length > 0 ? categorySales : EMPTY_CATEGORY;
  const pieData = orderStatus.length > 0 ? orderStatus : EMPTY_STATUS;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Category Sales */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 h-[350px] flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Sales by Category</h3>
        <p className="text-[11px] font-semibold text-slate-400 mb-4">{categorySubtitle}</p>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: '#F8FAFC' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 h-[350px] flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Order Status Distribution</h3>
        <p className="text-[11px] font-semibold text-slate-400 mb-4">{statusSubtitle}</p>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs font-bold text-slate-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
