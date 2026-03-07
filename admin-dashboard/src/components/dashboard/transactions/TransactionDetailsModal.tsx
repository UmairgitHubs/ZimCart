"use client";

import React from "react";
import { 
  X, 
  Receipt, 
  User, 
  CreditCard, 
  Smartphone, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Database,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Hash,
  Download,
  AlertCircle
} from "lucide-react";
import { Transaction } from "@/types/transactions";
import { cn } from "@/lib/utils";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed': return { 
        color: "text-emerald-600", 
        bg: "bg-emerald-50", 
        border: "border-emerald-100", 
        icon: CheckCircle2,
        label: "Settled" 
      };
      case 'Pending': return { 
        color: "text-blue-600", 
        bg: "bg-blue-50", 
        border: "border-blue-100", 
        icon: Clock,
        label: "Processing" 
      };
      case 'Failed': return { 
        color: "text-red-600", 
        bg: "bg-red-50", 
        border: "border-red-100", 
        icon: XCircle,
        label: "Auth Failed" 
      };
      case 'Refunded': return { 
        color: "text-amber-600", 
        bg: "bg-amber-50", 
        border: "border-amber-100", 
        icon: ShieldCheck,
        label: "Revoked" 
      };
      default: return { 
        color: "text-slate-500", 
        bg: "bg-slate-50", 
        border: "border-slate-100", 
        icon: ArrowUpRight,
        label: "Unknown" 
      };
    }
  };

  const status = getStatusConfig(transaction.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]" 
        onClick={onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Header - Standardized ZimCart Dashboard Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Receipt className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Financial Record</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Reference: {transaction.reference}</p>
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
          
          {/* Amount & Status Summary Card */}
          <section className="bg-slate-50 rounded-[20px] p-8 border border-slate-100 relative overflow-hidden text-left">
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Settled Amount</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-800 tabular-nums">{transaction.currency} {transaction.amount.toFixed(2)}</span>
                   </div>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-2">
                   <span className={cn(
                     "px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest flex items-center gap-2",
                     status.color, status.bg, status.border
                   )}>
                      <status.icon className="w-3.5 h-3.5" />
                      {status.label}
                   </span>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Verified by Gateway Alpha</p>
                </div>
             </div>
             {/* Subtle background icon */}
             <Receipt className="absolute -right-8 -bottom-8 w-40 h-40 text-slate-200/40 -rotate-12" />
          </section>

          {/* Transaction Metadata Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
             {/* Payer Information */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Entity Details</h4>
                   <div className="h-[1px] flex-1 bg-slate-50"></div>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                         <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Payer / Customer</p>
                         <p className="text-sm font-bold text-slate-800">{transaction.customerName}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                         <Database className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Order Association</p>
                         <p className="text-sm font-bold text-slate-800">{transaction.orderId}</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Execution Details */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Execution Intelligence</h4>
                   <div className="h-[1px] flex-1 bg-slate-50"></div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                         <Calendar className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Date & Time</p>
                         <p className="text-sm font-bold text-slate-800">
                           {new Date(transaction.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           <span className="text-slate-400 ml-2 font-medium">@ {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                         <Smartphone className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Payment Method</p>
                         <p className="text-sm font-bold text-slate-800">{transaction.paymentMethod}</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Technical Trace / Hash */}
          <section className="p-5 bg-white rounded-2xl border border-slate-100 text-left">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                   <Hash className="w-3.5 h-3.5 text-slate-300" />
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Digital Trace Header</span>
                </div>
                <div className="flex items-center gap-1">
                   <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                   <span className="text-[9px] font-black text-emerald-600 uppercase">SHA-256 Verified</span>
                </div>
             </div>
             <p className="text-[11px] font-mono text-slate-400 break-all leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                {transaction.id}
             </p>
          </section>

          {/* Post-Settlement Actions */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all active:scale-95 group">
                <Download className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Download Receipt</span>
             </button>
             <button className="flex items-center justify-center gap-3 p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all active:scale-95 group">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Report Issue</span>
             </button>
          </section>
        </div>

        {/* Footer - Standardized Dashboard Footer */}
        <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end">
           <button 
             onClick={onClose} 
             className="px-8 py-2.5 bg-emerald-600 text-white text-[11px] font-black rounded-xl hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/10 uppercase tracking-widest"
           >
             Close Record
           </button>
        </div>
      </div>

    </div>
  );
}
