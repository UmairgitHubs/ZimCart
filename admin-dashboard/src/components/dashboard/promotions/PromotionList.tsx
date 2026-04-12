"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  MoreHorizontal, 
  ChevronRight, 
  Ticket, 
  Calendar, 
  Clock,
  Trash2,
  Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Promotion } from "@/types/promotions";

interface PromotionListProps {
  promotions: Promotion[];
  onView: (promo: Promotion) => void;
  onEdit: (promo: Promotion) => void;
  onDelete: (promo: Promotion) => void;
}

export function PromotionList({ promotions, onView, onEdit, onDelete }: PromotionListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Campaign & Code</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Discount Details</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {promotions.map((promo) => (
              <tr key={promo.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-slate-800 leading-tight uppercase tracking-tight">{promo.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-white bg-slate-800 px-2 py-0.5 rounded-md tracking-widest">{promo.code}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black text-slate-800">
                      {promo.type === "Percentage"
                        ? `${promo.value}% off`
                        : `$${promo.value} off`}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                       Min. Purchase: ${promo.minPurchase || 0}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        <span>Starts</span>
                        <span>{promo.startDate ? new Date(promo.startDate).toLocaleDateString() : "—"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>Expires {new Date(promo.endDate).toLocaleDateString()}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="space-y-2 max-w-[120px]">
                      <div className="flex justify-between items-end">
                         <span className="text-[11px] font-black text-slate-700">{promo.usageCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : 'Redeems'}</span>
                         {promo.usageLimit && (
                           <span className="text-[9px] font-bold text-slate-400">{Math.round((promo.usageCount / promo.usageLimit) * 100)}%</span>
                         )}
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                         <div 
                           className={cn(
                             "h-full rounded-full transition-all duration-1000",
                             (promo.usageLimit && (promo.usageCount / promo.usageLimit) > 0.8) ? "bg-amber-500" : "bg-emerald-500"
                           )} 
                           style={{ width: `${promo.usageLimit ? (promo.usageCount / promo.usageLimit) * 100 : 100}%` }}
                         />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5",
                     promo.status === "Active"
                       ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                       : promo.status === "Scheduled"
                         ? "bg-blue-50 text-blue-600 border-blue-100"
                         : "bg-amber-50 text-amber-600 border-amber-100"
                   )}>
                     {promo.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right relative">
                   <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onView(promo)} 
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all active:scale-95 group/btn"
                        title="View Intelligence"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === promo.id ? null : promo.id)}
                          className={cn(
                            "p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all",
                            activeMenu === promo.id && "bg-slate-50 text-slate-800 border-slate-200"
                          )}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenu === promo.id && (
                          <div 
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in-95 duration-200"
                          >
                             <button 
                               onClick={() => { onEdit(promo); setActiveMenu(null); }}
                               className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                             >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                   <Edit2 className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Edit Campaign</span>
                             </button>
                             <div className="h-[1px] bg-slate-50 my-1 mx-2"></div>
                             <button 
                               onClick={() => { onDelete(promo); setActiveMenu(null); }}
                               className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors group"
                             >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                   <Trash2 className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">Terminate</span>
                             </button>
                          </div>
                        )}
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="xl:hidden p-4 space-y-4">
        {promotions.map((promo) => (
          <div 
            key={promo.id}
            className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.99] transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-black text-slate-800 uppercase tracking-tighter leading-tight mb-1">{promo.name}</h4>
                    <span className="text-[10px] font-black text-white bg-slate-800 px-2 py-0.5 rounded-md tracking-[2px]">{promo.code}</span>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                    promo.status === "Active"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : promo.status === "Scheduled"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                 )}>{promo.status}</span>
                 <div className="flex gap-2">
                   <button onClick={() => onEdit(promo)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-500 border border-slate-100">
                     <Edit2 className="w-3.5 h-3.5" />
                   </button>
                   <button onClick={() => onDelete(promo)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 border border-slate-100">
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Benefit Matrix</p>
                  <p className="text-sm font-black text-slate-800">
                     {promo.type === 'Percentage' ? `${promo.value}% OFF` : 
                      promo.type === 'Fixed Amount' ? `$${promo.value} OFF` : 'FREE SHIP'}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consumption</p>
                  <p className="text-sm font-black text-slate-800">{promo.usageCount} Times</p>
               </div>
            </div>

            <div className="flex items-center justify-between mt-6">
               <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Ends {new Date(promo.endDate).toLocaleDateString()}</span>
               </div>
               <button onClick={() => onView(promo)} className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 active:scale-90 transition-all">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
