"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface StepSuccessProps {
  successCount: number;
  errorCount: number;
  onFinish: () => void;
}

export function StepSuccess({ successCount, errorCount, onFinish }: StepSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-8 border-[10px] border-emerald-500/10 shadow-lg shadow-emerald-500/5 ring-8 ring-emerald-50/50">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      </div>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">Sync Completed!</h3>
      <p className="text-slate-500 font-medium mt-3 max-w-sm leading-relaxed px-4">
        Your inventory manifest has been processed. 
        <span className="text-emerald-600 font-bold ml-1">{successCount} successful</span> and 
        <span className="text-red-500 font-bold ml-1">{errorCount} failed</span> entries detected.
      </p>
      <button 
        onClick={onFinish}
        className="mt-10 px-12 py-4 bg-slate-900 text-white text-[14px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-90 shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-2xl"
      >
        Back to Inventory
      </button>
    </div>
  );
}
