"use client";

import React from "react";
import { 
  X, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Clock,
  Search,
  Filter,
  AlertCircle,
  Database,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { cn } from "@/lib/utils";
import { useInventoryHistory } from "@/hooks/useInventory";
import { format } from "date-fns";

interface InventoryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export function InventoryHistoryModal({ isOpen, onClose, item }: InventoryHistoryModalProps) {
  const { data: historyResponse, isLoading } = useInventoryHistory(item?.id || "");
  const history = historyResponse?.data || [];

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-400">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
              <History className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">Inventory Ledger</h2>
              <div className="flex items-center gap-2 mt-1.5">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">SKU Record: {item.sku}</p>
                 <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                 <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Verified Log</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search audit trail..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium focus:bg-white focus:border-emerald-500 transition-all outline-none"
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2 transition-all">
                <Filter className="w-3.5 h-3.5" /> Filter Logs
              </button>
           </div>
        </div>

        {/* Ledger Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#fbfcfd]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retrieving Digital Audit Trail...</p>
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((log: any, idx: number) => {
                const eventType = log.event.toLowerCase();
                const isInbound = eventType.includes('restock') || eventType.includes('initiated');
                const isAdjustment = eventType.includes('alignment');
                
                return (
                  <div key={log.id} className="group bg-white p-5 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                     <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-100 group-hover:bg-emerald-500 transition-colors hidden md:block"></div>
                     
                     <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                          isInbound ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          isAdjustment ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                           {isInbound ? <ArrowUpRight className="w-5 h-5" /> : 
                            isAdjustment ? <AlertCircle className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight leading-none">{log.event}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[200px] truncate">{log.description}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between md:justify-end gap-10">
                        <div className="flex flex-col text-right">
                           <p className="text-[10px] font-black text-slate-800 flex items-center justify-end gap-2 uppercase tracking-tighter">
                              <Calendar className="w-3 h-3 text-slate-300" /> {format(new Date(log.createdAt), 'yyyy-MM-dd')}
                           </p>
                           <p className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-2 mt-1">
                              <Clock className="w-3 h-3 text-slate-300" /> {format(new Date(log.createdAt), 'HH:mm')}
                           </p>
                        </div>
                        
                        {log.metadata?.new !== undefined && (
                          <div className={cn(
                            "min-w-[90px] py-2.5 px-4 rounded-xl text-center font-black text-sm border-2 shadow-sm",
                            isInbound ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                            isAdjustment ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
                          )}>
                             {log.metadata.new} PCS
                          </div>
                        )}
                     </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-[32px]">
               <Database className="w-12 h-12 text-slate-200 mb-4" />
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Historical Records Found</p>
               <p className="text-[11px] text-slate-300 font-medium mt-1">Lifecycle logs will be generated upon stock mutations.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-slate-50 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Integrity</p>
                  <p className="text-[11px] font-bold text-slate-700 uppercase">Synchronized with System Audit</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-500/10"
            >
              Terminate Session
            </button>
        </div>
      </div>
    </div>
  );
}
