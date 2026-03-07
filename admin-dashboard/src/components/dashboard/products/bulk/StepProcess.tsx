"use client";

import React from "react";

interface StepProcessProps {
  progress: number;
  successCount: number;
}

export function StepProcess({ progress, successCount }: StepProcessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-300 space-y-8">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 100">
          <circle 
            className="text-emerald-50 opacity-20" 
            strokeWidth="8" 
            stroke="currentColor" 
            fill="transparent" 
            r="40" 
            cx="50" 
            cy="50" 
          />
          <circle 
            className="text-emerald-500 transition-all duration-300" 
            strokeWidth="8" 
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            strokeLinecap="round" 
            stroke="currentColor" 
            fill="transparent" 
            r="40" 
            cx="50" 
            cy="50" 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800 text-lg">
          {progress}%
        </div>
      </div>
      <div className="text-center group">
        <p className="text-[14px] font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
           Processing Catalog Manifest...
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              {successCount} entities secured
           </p>
        </div>
      </div>
      <div className="w-full max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner ring-4 ring-slate-50">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300 shadow-sm shadow-emerald-500/20" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
