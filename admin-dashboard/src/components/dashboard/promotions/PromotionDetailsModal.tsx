"use client";

import React, { useEffect } from "react";
import { 
  X, 
  Ticket, 
  Tag, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  BarChart3,
  DollarSign,
  Percent,
  Truck,
  Building2,
  Info,
  ExternalLink,
  ChevronRight,
  Zap,
  Briefcase,
  History,
  Hash,
  ChevronDown
} from "lucide-react";
import { Promotion } from "@/types/promotions";
import { cn } from "@/lib/utils";

interface PromotionDetailsModalProps {
  promotion: Promotion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromotionDetailsModal({ promotion, isOpen, onClose }: PromotionDetailsModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !promotion) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case 'Scheduled': return "text-amber-600 bg-amber-50 border-amber-100";
      case 'Expired': return "text-red-600 bg-red-50 border-red-100";
      default: return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  const getIcon = () => {
    switch (promotion.type) {
      case 'Percentage': return Percent;
      case 'Fixed Amount': return DollarSign;
      case 'Free Shipping': return Truck;
      default: return Tag;
    }
  };

  const PromoIcon = getIcon();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Header - Standardized for ZimCart Dashboard */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm shadow-emerald-500/5">
              <Ticket className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Campaign Intelligence</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Protocol ID: {promotion.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all group active:scale-95"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 custom-scrollbar">
          
          {/* Hero Banner Section */}
          <section className="relative p-10 bg-slate-900 rounded-[40px] text-white overflow-hidden shadow-2xl shadow-emerald-900/10 group">
             {/* Abstract background graphics */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -z-0" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -z-0" />
             
             <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-4 max-w-xl text-left">
                   <div className="flex items-center gap-3">
                      <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-[2px]", getStatusColor(promotion.status))}>
                         {promotion.status}
                      </span>
                      <div className="flex items-center gap-2 text-emerald-400/60 text-[10px] font-black uppercase tracking-widest">
                         <Clock className="w-3.5 h-3.5" />
                         <span>Campaign Cycle Alpha</span>
                      </div>
                   </div>
                   <h1 className="text-4xl font-black tracking-tight leading-tight uppercase underline decoration-emerald-500/40 underline-offset-8 decoration-4">
                      {promotion.name}
                   </h1>
                   <p className="text-sm font-medium text-white/70 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 py-1">
                      "{promotion.description || "No strategic narrative established for this specific campaign protocol."}"
                   </p>
                </div>

                <div className="w-full lg:w-auto p-8 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 flex flex-col items-center justify-center min-w-[240px] shadow-2xl group-hover:border-emerald-500/50 transition-all duration-500">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[4px] mb-4 opacity-70">Redemption Code</p>
                   <div className="flex flex-col items-center">
                      <p className="text-3xl font-black tracking-[0.2em] text-white mb-1 drop-shadow-lg text-center break-all">{promotion.code}</p>
                      <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                   </div>
                </div>
             </div>
             
             <PromoIcon className="absolute -right-12 -bottom-12 w-64 h-64 text-emerald-500/10 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
          </section>

          {/* Quick Stats Matrix */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: "Gross Redeems", val: promotion.usageCount, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50/50" },
               { label: "Discount Value", val: promotion.type === 'Percentage' ? `${promotion.value}% OFF` : promotion.type === 'Free Shipping' ? 'FREE' : `$${promotion.value} OFF`, icon: PromoIcon, color: "text-emerald-600", bg: "bg-emerald-50/50" },
               { label: "Category Scope", val: promotion.targetCategory || 'Global Fleet', icon: Building2, color: "text-emerald-500", bg: "bg-emerald-50/50" },
               { label: "Min. Threshold", val: promotion.minPurchase ? `$${promotion.minPurchase}` : 'No Minimum', icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50/50" },
             ].map((stat, idx) => (
               <div key={idx} className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner", stat.bg)}>
                     <stat.icon className={cn("w-7 h-7", stat.color)} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-800 tracking-tighter">{stat.val}</p>
               </div>
             ))}
          </section>

          {/* Configuration Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-50">
             <div className="space-y-8 text-left">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Chronology</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Deployment Timeline</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:bg-white hover:border-emerald-100 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                            <Clock className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Activation Date</p>
                            <p className="text-sm font-black text-slate-700">{new Date(promotion.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[24px] border border-slate-100 hover:bg-white hover:border-emerald-100 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                            <History className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Termination Date</p>
                            <p className="text-sm font-black text-slate-700">{new Date(promotion.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-8 text-left">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                      <Hash className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Constraints</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Consumption Limits</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <div className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-emerald-100 shadow-md shadow-emerald-500/5">
                      <div className="space-y-1 flex-1">
                         <div className="flex justify-between items-center mb-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Usage Progress</p>
                            <p className="text-[10px] font-black text-emerald-600">
                               {promotion.usageCount} / {promotion.usageLimit || '∞'} 
                            </p>
                         </div>
                         <div className="w-full h-2 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100/50">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${promotion.usageLimit ? (promotion.usageCount / promotion.usageLimit) * 100 : 100}%` }}
                            />
                         </div>
                      </div>
                   </div>
                   <div className="p-5 bg-emerald-50/50 rounded-[24px] border border-emerald-100 flex items-start gap-4 shadow-sm shadow-emerald-500/5">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center">
                        <Info className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-[11px] font-medium text-emerald-800/80 leading-relaxed italic">
                         Campaign remains operational within established parameters. Next automated health check scheduled in 4.2 hours.
                      </p>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Footer - Standardized for ZimCart Dashboard */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end">
           <button 
             onClick={onClose} 
             className="px-10 py-3.5 bg-emerald-600 text-white text-[11px] font-black rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-500/25 uppercase tracking-[0.2em]"
           >
             Close Protocol View
           </button>
        </div>
      </div>

    </div>
  );
}
