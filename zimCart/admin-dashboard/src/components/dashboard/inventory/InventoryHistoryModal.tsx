"use client";

import React from "react";
import { 
  X, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  User, 
  Calendar, 
  Clock,
  Search,
  Filter,
  AlertCircle,
  Hash,
  Database,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface InventoryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

const MOCK_LOGS = [
  { id: "LOG-001", type: "Inbound", change: "+120", reason: "Restock", user: "Admin John", date: "2026-02-26 14:30" },
  { id: "LOG-002", type: "Outbound", change: "-12", reason: "Order #4492", user: "System", date: "2026-02-26 11:20" },
  { id: "LOG-003", type: "Audit", change: "-5", reason: "Damage Found", user: "Manager Sara", date: "2026-02-25 09:15" },
  { id: "LOG-004", type: "Inbound", change: "+45", reason: "Return Processed", user: "Support Mike", date: "2026-02-24 16:45" },
  { id: "LOG-005", type: "Outbound", change: "-8", reason: "Order #4481", user: "System", date: "2026-02-24 10:30" },
];

export function InventoryHistoryModal({ isOpen, onClose, item }: InventoryHistoryModalProps) {
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
          <div className="space-y-4">
            {MOCK_LOGS.map((log, idx) => {
              const isInbound = log.type === "Inbound";
              const isAudit = log.type === "Audit";
              return (
                <div key={log.id} className="group bg-white p-5 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                   {/* Vertical Connector dot indicator */}
                   <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-100 group-hover:bg-emerald-500 transition-colors hidden md:block"></div>
                   
                   <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
                        isInbound ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                        isAudit ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                         {isInbound ? <ArrowUpRight className="w-5 h-5" /> : 
                          isAudit ? <AlertCircle className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      
                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight leading-none">{log.reason}</p>
                        <div className="flex items-center gap-3 mt-2">
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-widest",
                             isInbound ? "text-emerald-500" : isAudit ? "text-amber-500" : "text-blue-500"
                           )}>{log.type}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                           <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400">{log.user}</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between md:justify-end gap-10">
                      <div className="flex flex-col text-right">
                         <p className="text-[10px] font-black text-slate-800 flex items-center justify-end gap-2 uppercase tracking-tighter">
                            <Calendar className="w-3 h-3 text-slate-300" /> {log.date.split(' ')[0]}
                         </p>
                         <p className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-2 mt-1">
                            <Clock className="w-3 h-3 text-slate-300" /> {log.date.split(' ')[1]}
                         </p>
                      </div>
                      
                      <div className={cn(
                        "min-w-[90px] py-2.5 px-4 rounded-xl text-center font-black text-sm border-2 shadow-sm",
                        isInbound ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
                        isAudit ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                         {isInbound ? `+ ${log.change.replace('+', '')}` : log.change}
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-slate-50 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Integrity</p>
                  <p className="text-[11px] font-bold text-slate-700 uppercase">Synchronized with Global CDN</p>
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
