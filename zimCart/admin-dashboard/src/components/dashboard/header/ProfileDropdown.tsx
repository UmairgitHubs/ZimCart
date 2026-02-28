"use client";

import React from "react";
import { User, Settings, Star, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/5 backdrop-blur-[2px] z-[55] md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className={cn(
        "absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 transform-gpu z-[60]"
      )}>
         <div className="p-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 flex items-start justify-between">
            <div>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Identity</p>
               <p className="text-[14px] font-bold text-slate-800 mt-1">zain.ali@zimcart.com</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
         </div>
         <div className="p-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all outline-none">
              <User className="w-4 h-4" /> Account Blueprint
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all outline-none">
              <Settings className="w-4 h-4" /> System Control
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all border-b border-slate-50 outline-none">
              <Star className="w-4 h-4" /> Reputation Tier
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all mt-1 outline-none">
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
         </div>
      </div>
    </>
  );
}
