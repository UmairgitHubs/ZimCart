"use client";

import React from "react";
import { CheckCircle, Clock, ShoppingBag, ShieldCheck, AlertCircle, Package, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: 1, type: "order", title: "New Mart Order", desc: "SuperMart just received an order #ZN-881", time: "2 mins ago", icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />, unread: true },
  { id: 2, type: "verification", title: "Verification Approved", desc: "Bakery Central is now a Verified Partner", time: "1 hour ago", icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, unread: true },
  { id: 3, type: "alert", title: "Stock Warning", desc: "Inventory low for 'Peshawari Chappal' (5 left)", time: "4 hours ago", icon: <AlertCircle className="w-4 h-4 text-orange-500" />, unread: false },
  { id: 4, type: "logistic", title: "Rider Assigned", desc: "Rider 'Zain' assigned to order #ZN-772", time: "Yesterday", icon: <Package className="w-4 h-4 text-blue-500" />, unread: false },
];

export function NotificationsDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/5 backdrop-blur-[2px] z-[55] md:hidden animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className={cn(
        "fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:mt-3 w-auto md:w-[420px] bg-white/95 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 transform-gpu z-[60]",
        "hover:shadow-blue-500/5 transition-shadow"
      )}>
        <div className="p-6 flex items-center justify-between bg-gradient-to-br from-slate-50/50 to-white border-b border-slate-100/80">
           <div>
              <h3 className="text-[14px] font-bold text-slate-800 tracking-tight">Activity Feed</h3>
              <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">2 Critical Alerts Pending</p>
           </div>
           <div className="flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 outline-none" title="Mark all as read">
                 <CheckCircle className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 outline-none"
              >
                 <X className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="max-h-[440px] overflow-y-auto custom-scrollbar">
           {NOTIFICATIONS.map(notif => (
             <div key={notif.id} className={cn(
               "p-5 flex gap-4 hover:bg-slate-50/80 transition-all cursor-pointer border-b border-slate-100/50 last:border-0 group/notif", 
               notif.unread && "bg-blue-50/10"
             )}>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover/notif:scale-105 transition-transform duration-300">
                   {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[14px] font-bold text-slate-800 tracking-tight group-hover/notif:text-blue-600 transition-colors">{notif.title}</p>
                   <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.desc}</p>
                   <div className="flex items-center gap-2.5 mt-2.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{notif.time}</span>
                   </div>
                </div>
                {notif.unread && (
                  <div className="flex flex-col justify-start pt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/10 animate-pulse" />
                  </div>
                )}
             </div>
           ))}
        </div>

        <div className="p-5 text-center border-t border-slate-100/80 bg-slate-50/30">
           <button className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest hover:underline hover:underline-offset-8 decoration-2 transition-all outline-none">
             Audit Historical Stream
           </button>
        </div>
      </div>
    </>
  );
}
