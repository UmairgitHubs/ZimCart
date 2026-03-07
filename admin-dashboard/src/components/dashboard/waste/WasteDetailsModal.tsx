"use client";

import React from "react";
import { 
  X, 
  AlertOctagon, 
  User, 
  Database, 
  Calendar, 
  Info,
  Package,
  DollarSign,
  FileText,
  Clock,
  ShieldCheck,
  CircleDot
} from "lucide-react";
import { WasteLogEntry } from "@/types/waste";
import { cn } from "@/lib/utils";

interface WasteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: WasteLogEntry | null;
}

export function WasteDetailsModal({ isOpen, onClose, log }: WasteDetailsModalProps) {
  if (!isOpen || !log) return null;

  const getReasonStyles = (reason: string) => {
    switch (reason) {
      case 'Expired': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
      case 'Damaged': return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertOctagon };
      case 'Leaked': return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: CircleDot };
      case 'Spoilage': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: Info };
      case 'Lost': return { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: Database };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: Info };
    }
  };

  const styles = getReasonStyles(log.reason);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm", styles.bg, styles.border)}>
              <styles.icon className={cn("w-6 h-6", styles.text)} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Waste Log Record</h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Audit Intelligence: {log.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all active:scale-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
          
          {/* Top Summary Card */}
          <div className="relative group p-8 rounded-[32px] bg-slate-50 border border-slate-100 overflow-hidden text-left">
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest leading-none">
                      {log.sku}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-widest leading-none", styles.bg, styles.text, styles.border)}>
                      {log.reason}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight mb-1">{log.productName}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{log.category}</p>
                </div>
                <div className="text-left md:text-right">
                   <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Loss Impact</p>
                   <p className="text-3xl font-bold text-rose-600 tracking-tighter tabular-nums decoration-rose-500/10 underline-offset-8">
                     ${log.totalLoss.toFixed(2)}
                   </p>
                </div>
             </div>
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full -z-0"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            {/* Left: Metadata */}
            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Package className="w-5 h-5 text-rose-600" />
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Inventory Intelligence</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity Purged</p>
                        <p className="text-sm font-bold text-slate-800">{log.quantity} Units</p>
                     </div>
                     <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Asset Cost</p>
                        <p className="text-sm font-bold text-slate-800">${log.unitCost.toFixed(2)}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-rose-600" />
                     <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Audit Chain</h4>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                           <User className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Authorization</p>
                           <p className="text-sm font-semibold text-slate-700">{log.loggedBy}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                           <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Timestamp</p>
                           <p className="text-sm font-semibold text-slate-700">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Narrative */}
            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-rose-600" />
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Log Narrative</h4>
                  </div>
                  <div className="p-6 bg-rose-50/30 rounded-[32px] border border-rose-100 italic">
                     <p className="text-sm text-rose-900 leading-relaxed font-medium">
                       &quot;{log.notes || 'No operational narrative provided for this event.'}&quot;
                     </p>
                  </div>
               </div>

              
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           {/* <button 
             className="px-8 py-3 bg-white border border-slate-200 text-slate-600 text-xs font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest flex items-center gap-2"
           >
             <FileText className="w-4 h-4" />
             Extract PDF
           </button> */}
           <button 
             onClick={onClose}
             className="px-10 py-3 bg-red-600 text-white text-xs font-black rounded-2xl hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest shadow-xl shadow-slate-200"
           >
             Close
           </button>
        </div>

      </div>
    </div>
  );
}
