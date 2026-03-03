"use client";

import React from "react";
import { Upload, Download, Info } from "lucide-react";

interface StepSelectProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function StepSelect({ onFileSelect, onDownloadTemplate, fileInputRef }: StepSelectProps) {
  return (
    <div className="space-y-8">
      {/* Dropzone */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[34px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative border-4 border-dashed border-slate-100 rounded-[32px] p-12 flex flex-col items-center justify-center gap-4 bg-white hover:border-emerald-200 transition-all group/box shadow-sm group-hover:shadow-md">
           <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center group-hover/box:bg-emerald-50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover/box:text-emerald-600 group-hover/box:-translate-y-1 transition-all" />
           </div>
           <div className="text-center">
              <p className="text-sm font-black text-slate-800 tracking-tight">Upload Your File</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Accepts .xlsx and .csv files</p>
           </div>
           <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept=".xlsx,.xls,.csv"
            onChange={onFileSelect}
           />
        </div>
      </div>

      {/* Info & Template */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-[28px] flex gap-4">
           <Info className="w-5 h-5 text-blue-500 shrink-0" />
           <div>
              <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest">Protocol Rules</p>
              <p className="text-[11px] font-medium text-blue-600/80 mt-1 leading-relaxed">
                Ensure headers match exactly as defined in the template for successful ingestion.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
