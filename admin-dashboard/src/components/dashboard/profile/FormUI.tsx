"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Upload, ChevronRight, CheckCircle2 } from "lucide-react";

export function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex items-start gap-4 pb-8 border-b border-slate-100 mb-8 animate-in fade-in slide-in-from-left duration-700">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-100/50 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/5">
        <div className="text-emerald-500">{icon}</div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-1">{title}</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-lg">{subtitle}</p>
      </div>
    </div>
  );
}

export function InputField({ label, value, onChange, type = "text", placeholder, icon }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, icon?: React.ReactNode }) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1 font-sans">{label}</label>
      </div>
      <div className="relative group/input">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors duration-300">
            {icon}
          </div>
        )}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 outline-none transition-all duration-300 font-medium",
            "focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-sm hover:border-slate-300",
            icon && "pl-12"
          )}
        />
        {/* Subtle Neon Underline on focus */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-500 rounded-full group-focus-within/input:w-[96%] transition-all duration-500" />
      </div>
    </div>
  );
}

export function SelectField({ label, options, value, onChange, icon }: { label: string, options: string[], value: string, onChange: (v: string) => void, icon?: React.ReactNode }) {
  return (
    <div className="space-y-2 group">
       <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1 font-sans">{label}</label>
       <div className="relative group/input">
         {icon && (
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors duration-300 pointer-events-none">
             {icon}
           </div>
         )}
         <select 
           value={value}
           onChange={(e) => onChange(e.target.value)}
           className={cn(
             "w-full bg-slate-50/50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 outline-none transition-all duration-300 font-medium appearance-none cursor-pointer",
             "focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white shadow-sm hover:border-slate-300",
             icon && "pl-12"
           )}
         >
           {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
         </select>
         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
           <ChevronRight className="w-4 h-4 rotate-90" />
         </div>
       </div>
    </div>
  );
}

export function FileUploadField({ label, subtitle, icon }: { label: string, subtitle?: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-2">
       <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1">{label}</label>
       <div className="relative group">
          <div className="border-2 border-dashed border-slate-200/80 bg-slate-50/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all duration-300 cursor-pointer shadow-sm">
             <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-slate-200/40">
                {icon || <Upload className="w-6 h-6" />}
             </div>
             <p className="text-[13px] font-semibold text-slate-700 tracking-tight">Drop your files or click</p>
             {subtitle && <p className="text-[11px] text-slate-400 font-medium tracking-wide">{subtitle}</p>}
             
             {/* Progress simulation bar on hover */}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-slate-100 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-full bg-emerald-500 animate-pulse w-full translate-x-[-100%] animate-[slide-in-loop_2s_infinite]" />
             </div>
          </div>
       </div>
    </div>
  );
}

export function ReviewCard({ title, items, onEdit }: { title: string, items: { label: string, value: string }[], onEdit?: () => void }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/50 overflow-hidden group hover:border-emerald-200/50 transition-all duration-500">
       <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white/50 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-[12px] font-semibold text-slate-800 tracking-widest uppercase">{title}</h4>
          {onEdit && (
            <button 
              onClick={onEdit}
              className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-emerald-100/50 hover:bg-emerald-600 hover:text-white transition-all duration-400"
            >
              Modify
            </button>
          )}
       </div>
       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          {items.map((item, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-top-1 duration-500 delay-100">
               <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mb-2">{item.label}</p>
               <p className="text-[14px] font-semibold text-slate-700">{item.value || "Not Specified"}</p>
            </div>
          ))}
       </div>
    </div>
  );
}

