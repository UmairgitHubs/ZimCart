import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, MoreHorizontal, AlertOctagon, CircleDot, DollarSign, Box, Edit2, Trash2 } from "lucide-react";
import { WasteLogEntry } from "@/types/waste";
import { cn } from "@/lib/utils";

interface WasteListProps {
  logs: WasteLogEntry[];
  onView: (log: WasteLogEntry) => void;
  onEdit: (log: WasteLogEntry) => void;
  onDelete: (log: WasteLogEntry) => void;
}

export function WasteList({ logs, onView, onEdit, onDelete }: WasteListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const useRefValue = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (useRefValue.current && !useRefValue.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Expired': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Damaged': return 'text-red-600 bg-red-50 border-red-100';
      case 'Leaked': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Spoilage': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Lost': return 'text-slate-600 bg-slate-100 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="w-full">
      {/* Mobile View: Premium Cards Layout */}
      <div className="md:hidden flex flex-col gap-4 p-4 bg-slate-50/30">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 group"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-800 leading-snug">{log.productName}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{log.sku}</span>
                    <span className="text-[9px] font-semibold text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => onEdit(log)}
                  className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(log)}
                  className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status & Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Reason</p>
                  <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider w-max border px-2 py-0.5 rounded-lg shadow-sm font-semibold", getReasonColor(log.reason))}>
                    <CircleDot className="w-3 h-3" />
                    {log.reason}
                  </span>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Quantity Lost</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                    <Box className="w-4 h-4 text-slate-400" /> 
                    <span>{log.quantity} units</span>
                  </div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Category</p>
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600">
                     {log.category}
                  </div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Total Loss</p>
                  <div className="flex items-center gap-1.5 text-[14px] font-black text-rose-600">
                    <DollarSign className="w-4 h-4 text-rose-500" /> {log.totalLoss.toFixed(2)}
                  </div>
               </div>
            </div>

            {log.notes && (
               <div className="mb-5 p-3 bg-slate-50 rounded-xl text-[12px] font-medium text-slate-500 italic border border-slate-100">
                  &quot;{log.notes}&quot;
               </div>
            )}

            <button 
              onClick={() => onView(log)}
              className="w-full py-3 bg-slate-800 text-white text-[13px] font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              View Log Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop View: Ultra-Refined Table Layout */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-500">
              <th className="px-8 py-4 rounded-tl-[40px]">Asset Info</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Metrics</th>
              <th className="px-6 py-4">Impact</th>
              <th className="px-6 py-4">Audit Trace</th>
              <th className="px-8 py-4 text-right rounded-tr-[40px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="group hover:bg-slate-50/40 transition-colors duration-300">
                
                {/* Product Info Details */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <AlertOctagon className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors tracking-tight">{log.productName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{log.sku}</span>
                        <span className="text-[11px] font-medium text-slate-400">Ref: {log.id}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status & Location Info */}
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-1.5">
                      <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-max shadow-sm border", getReasonColor(log.reason))}>
                        <CircleDot className="w-3 h-3" />
                        {log.reason}
                      </span>
                      {log.notes && (
                         <p className="text-[10px] font-medium text-slate-500 truncate max-w-[150px]" title={log.notes}>
                            {log.notes}
                         </p>
                      )}
                   </div>
                </td>

                {/* Quantity Info */}
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <div className="w-7 h-7 bg-white border border-slate-100 shadow-sm rounded-lg flex items-center justify-center">
                            <Box className="w-3.5 h-3.5 text-slate-600" />
                         </div>
                         <div>
                            <p className="text-[13px] font-bold text-slate-800">{log.quantity} Items</p>
                         </div>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 ml-[36px] uppercase tracking-wider">{log.category}</p>
                   </div>
                </td>
                
                {/* Value Impact */}
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                         <span className="text-[13px] font-bold text-rose-600">${log.totalLoss.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400">Unit Cost: ${log.unitCost.toFixed(2)}</p>
                   </div>
                </td>

                {/* Manager Ref */}
                <td className="px-6 py-6 text-[11px]">
                   <p className="font-bold text-slate-700">{log.loggedBy}</p>
                   <p className="font-medium text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                </td>

                {/* Action Buttons */}
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <button 
                      onClick={() => onView(log)}
                      className="p-2 w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center group/btn"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === log.id ? null : log.id)}
                        className={cn(
                          "p-2 w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center",
                          activeMenu === log.id && "bg-slate-50 border-slate-300 text-slate-800"
                        )}
                        title="More Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenu === log.id && (
                        <div 
                          ref={useRefValue}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in-95 duration-200"
                        >
                           <button 
                             onClick={() => { onEdit(log); setActiveMenu(null); }}
                             className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors group/item"
                           >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover/item:scale-110 transition-transform">
                                 <Edit2 className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Edit Entry</span>
                           </button>
                           <div className="h-[1px] bg-slate-50 my-1 mx-2"></div>
                           <button 
                             onClick={() => { onDelete(log); setActiveMenu(null); }}
                             className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors group/item"
                           >
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover/item:scale-110 transition-transform">
                                 <Trash2 className="w-4 h-4" />
                              </div>
                              <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">Purge Log</span>
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
    </div>
  );
}
