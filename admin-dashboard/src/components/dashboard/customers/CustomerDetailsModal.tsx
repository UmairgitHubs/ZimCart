"use client";

import React, { useEffect } from "react";
import { 
  X, User, Mail, Phone, MapPin, 
  Calendar, CreditCard, ShoppingBag, 
  ShieldCheck, ExternalLink, Globe,
  Activity, Star, Clock
} from "lucide-react";
import Image from "next/image";
import { Customer } from "@/types/customers";
import { cn } from "@/lib/utils";

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsModal({ customer, isOpen, onClose }: CustomerDetailsModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-400">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Customer Profile</h2>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">ID: {customer.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* Top Section: Avatar and Base Stats */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden shrink-0 shadow-inner">
               {customer.avatar ? (
                 <Image src={customer.avatar} alt={customer.name} fill className="object-cover" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                   <User className="w-10 h-10" />
                 </div>
               )}
            </div>
            
            <div className="flex-1 space-y-4 pt-1">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{customer.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5",
                      customer.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", customer.status === 'Active' ? "bg-emerald-500" : "bg-amber-500")}></span>
                      {customer.status}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      <Star className="w-3 h-3 fill-current" /> Platinum Client
                    </span>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <ShoppingBag className="w-3 h-3" /> Orders
                     </p>
                     <p className="text-sm font-bold text-slate-700">{customer.totalOrders} Placed</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <CreditCard className="w-3 h-3" /> Total Spent
                     </p>
                     <p className="text-sm font-bold text-slate-700">${customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Activity className="w-3 h-3" /> Avg. Order
                     </p>
                     <p className="text-sm font-bold text-slate-700">${(customer.totalSpent / (customer.totalOrders || 1)).toFixed(2)}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Information</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-colors hover:border-emerald-100 hover:bg-white">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-colors hover:border-emerald-100 hover:bg-white">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Lifecycle</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-colors hover:border-emerald-100 hover:bg-white">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Join Date</p>
                        <p className="text-xs font-black text-slate-700">{new Date(customer.joinDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-colors hover:border-emerald-100 hover:bg-white">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Primary Location</p>
                        <p className="text-xs font-black text-slate-700">{customer.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             <div className="p-4 bg-emerald-50/30 rounded-[20px] border border-emerald-100/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[11px] font-medium text-emerald-800/80 leading-relaxed italic">
                  This user has a confirmed email address and has performed <span className="font-black text-emerald-700">0 dispute actions</span> in the last 12 months. Account status is verified by ZimCart Guard.
                </p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10 uppercase tracking-widest"
           >
             Close Profile
           </button>
        </div>

      </div>
    </div>
  );
}
