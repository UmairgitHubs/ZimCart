"use client";

import React from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  { id: 1, sender: "SuperMart Support", text: "We need approval for the new promotion budget...", time: "10 mins ago", avatar: "SS", color: "bg-emerald-100 text-emerald-700", unread: true },
  { id: 2, sender: "Zain (Rider)", text: "I've reached the pickup location for order #992", time: "45 mins ago", avatar: "ZA", color: "bg-blue-100 text-blue-700", unread: true },
  { id: 3, sender: "Compliance Dept", text: "Your quarterly audit report is ready for review.", time: "2 days ago", avatar: "CD", color: "bg-slate-100 text-slate-700", unread: false },
];

export function MessagesDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/5 backdrop-blur-[2px] z-[55] md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className={cn(
        "fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:mt-3 w-auto md:w-[380px] bg-white/95 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 transform-gpu z-[60]",
        "hover:shadow-emerald-500/10 transition-shadow"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100/80">
           <div className="flex items-center gap-3">
              <h3 className="text-[14px] font-bold text-slate-800 tracking-tight">Inbox</h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">2 New</span>
           </div>
           <div className="flex items-center gap-2">
              <button className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all active:scale-95 outline-none">
                New Message
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
           </div>
        </div>
        
        <div className="max-h-[440px] overflow-y-auto custom-scrollbar">
           {MESSAGES.map(msg => (
             <div key={msg.id} className={cn(
               "p-5 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer group/msg border-b border-slate-50 last:border-0", 
               msg.unread && "bg-emerald-50/10"
             )}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-[13px] shadow-sm group-hover/msg:scale-105 transition-transform duration-300", 
                  msg.color
                )}>
                   {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-1">
                      <p className="text-[14px] font-bold text-slate-800 truncate group-hover/msg:text-emerald-600 transition-colors">{msg.sender}</p>
                      <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                   </div>
                   <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed group-hover/msg:text-slate-600 transition-colors">
                     {msg.text}
                   </p>
                </div>
                {msg.unread && (
                  <div className="flex flex-col justify-start pt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
                  </div>
                )}
             </div>
           ))}
        </div>
        
        <div className="p-5 bg-slate-50/30 border-t border-slate-100/80 text-center">
           <button className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors hover:scale-105 active:scale-95 outline-none">
             Open Full Communicator
           </button>
        </div>
      </div>
    </>
  );
}
