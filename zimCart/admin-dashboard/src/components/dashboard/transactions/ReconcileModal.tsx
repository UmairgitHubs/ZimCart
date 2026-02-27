"use client";

import React, { useState } from "react";
import { 
  X, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  Layers,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReconcileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReconcileModal({ isOpen, onClose, onConfirm }: ReconcileModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReconcile = async () => {
    setIsProcessing(true);
    // Simulate complex reconciliation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onConfirm();
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px]" 
        onClick={isProcessing ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Content */}
        <div className="p-8 md:p-10 text-center">
          {!isSuccess ? (
            <>
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className={cn(
                  "absolute inset-0 bg-emerald-50 rounded-[35px] border border-emerald-100 flex items-center justify-center transition-all duration-700",
                  isProcessing ? "animate-pulse scale-110 rotate-180" : "animate-bounce"
                )}>
                  <RefreshCw className={cn("w-10 h-10 text-emerald-600", isProcessing && "animate-spin")} />
                </div>
                {isProcessing && (
                  <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg border border-slate-100 animate-in zoom-in-50 duration-500">
                    <Database className="w-5 h-5 text-blue-500 animate-pulse" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-tight">
                Ledger <span className="text-emerald-600">Reconciliation</span>
              </h2>
              
              <p className="text-sm font-bold text-slate-400 mt-4 max-w-xs mx-auto leading-relaxed">
                Initiate automated audit protocol to synchronize transaction records with the banking gateway.
              </p>

              <div className="mt-10 space-y-3">
                 <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex flex-col gap-4 text-left">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Period</span>
                       </div>
                       <span className="text-[11px] font-black text-slate-800 uppercase italic">Last 24 Hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Database</span>
                       </div>
                       <span className="text-[11px] font-black text-slate-800 uppercase italic">Main Ledger Alpha</span>
                    </div>
                 </div>

                 <div className="p-5 bg-emerald-50/30 rounded-[28px] border border-emerald-100/50 flex items-start gap-4 text-left group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-emerald-100 shrink-0">
                       <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[11px] font-medium text-emerald-800/70 leading-relaxed italic mt-1">
                       Synchronizing now ensures balance integrity and prevents settlement delays for verified merchants.
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-4 mt-10">
                 <button 
                   onClick={onClose}
                   disabled={isProcessing}
                   className="flex-1 py-4 text-[11px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-widest border border-slate-100"
                 >
                   Recall
                 </button>
                 <button 
                   onClick={handleReconcile}
                   disabled={isProcessing}
                   className={cn(
                     "flex-[1.5] py-4 bg-slate-800 text-white text-[11px] font-black rounded-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 uppercase tracking-widest leading-none",
                     isProcessing && "opacity-70 cursor-not-allowed scale-[0.98]"
                   )}
                 >
                   {isProcessing ? "Executing Audit..." : "Initiate Audit"}
                 </button>
              </div>
            </>
          ) : (
            <div className="py-10 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-emerald-500 rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12 text-white animate-in slide-in-from-bottom-2 duration-700" />
               </div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase mb-2">Sync Successful</h2>
               <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm">
                 All financial records have been verified and settled with the ZimCart master ledger.
               </p>
               <div className="mt-10 flex flex-col items-center gap-2">
                 <div className="w-12 h-1 bg-emerald-50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-progress origin-left" />
                 </div>
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[4px] animate-pulse">Finalizing Protocol</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
