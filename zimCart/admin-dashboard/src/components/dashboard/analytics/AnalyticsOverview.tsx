"use client";

import React from "react";
import { 
  TopProduct, 
  RegionStats 
} from "@/types/analytics";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsOverviewProps {
  topProducts: TopProduct[];
  regionStats: RegionStats[];
}

export function AnalyticsOverview({ topProducts, regionStats }: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Top Products Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Top Sellers</h3>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Highest Revenue Drivers</p>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sold</th>
                <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue</th>
                <th className="pb-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topProducts.map((product) => (
                <tr key={product.id} className="group transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                         <Package className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="truncate max-w-[180px] sm:max-w-[250px]">
                         <p className="text-[13px] font-black text-slate-800 truncate">{product.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-[13px] font-black text-slate-700">{product.sold.toLocaleString()}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-[13px] font-black text-slate-800">${product.revenue.toLocaleString()}</span>
                  </td>
                  <td className="py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-black tracking-tighter",
                      product.trend === 'up' ? "text-emerald-600 bg-emerald-50" :
                      product.trend === 'down' ? "text-red-500 bg-red-50" :
                      "text-slate-500 bg-slate-50"
                    )}>
                      {product.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                       product.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                       <Minus className="w-3.5 h-3.5" />}
                      <span>{product.trendValue}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Performance Stats */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm">
        <div className="mb-8">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Regional Sales</h3>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Revenue by Province & City</p>
        </div>

        <div className="flex flex-col gap-6">
           {regionStats.map((stat, index) => (
              <div key={stat.region} className="group">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                       <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border",
                          index === 0 ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          index === 1 ? "bg-blue-50 border-blue-100 text-blue-600" :
                          index === 2 ? "bg-amber-50 border-amber-100 text-amber-600" :
                          "bg-slate-50 border-slate-100 text-slate-500"
                       )}>
                          <MapPin className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{stat.region}</p>
                          <p className="text-[11px] font-bold text-slate-400">{stat.sales.toLocaleString()} Orders</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-lg font-black text-slate-800 tracking-tight">${stat.revenue.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3 relative">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        index === 0 ? "bg-emerald-500" :
                        index === 1 ? "bg-blue-500" :
                        index === 2 ? "bg-amber-500" :
                        "bg-slate-400"
                      )}
                      style={{ width: `${stat.percentage}%` }}
                    />
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
