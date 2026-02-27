"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Receipt,
  User,
  Database,
  Hash,
  AlertCircle,
  Save,
  Clock,
  Smartphone,
  CreditCard
} from "lucide-react";
import { Transaction, TransactionStatus } from "@/types/transactions";
import { cn } from "@/lib/utils";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedTrx: Transaction) => void;
  transaction: Transaction | null;
}

export function EditTransactionModal({ isOpen, onClose, onConfirm, transaction }: EditTransactionModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm({ ...transaction, ...formData } as Transaction);
    setIsSaving(false);
    onClose();
  };

  const statusOptions: { value: TransactionStatus; icon: any; color: string; bg: string; border: string }[] = [
    { value: 'Completed', icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { value: 'Pending', icon: Clock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { value: 'Failed', icon: X, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { value: 'Refunded', icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={isSaving ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Header - Standardized Professional Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Receipt className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Update Ledger Entry</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{transaction.reference}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* Read-only Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
             <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                   <User className="w-4 h-4 text-slate-400" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">{transaction.customerName}</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                   <Database className="w-4 h-4 text-slate-400" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount & Method</span>
                </div>
                <p className="text-sm font-bold text-slate-800">{transaction.currency} {transaction.amount.toFixed(2)} — {transaction.paymentMethod}</p>
             </div>
          </section>

          {/* Status Selection Logic */}
          <section className="space-y-4 text-left">
             <div className="flex items-center gap-3">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Override Status</h4>
                <div className="h-[1px] flex-1 bg-slate-50"></div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {statusOptions.map((option) => (
                   <button
                     key={option.value}
                     onClick={() => setFormData({ ...formData, status: option.value })}
                     className={cn(
                       "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95 text-left group",
                       formData.status === option.value 
                         ? "bg-white border-emerald-500 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20" 
                         : "bg-white border-slate-100 hover:border-slate-200"
                     )}
                   >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                        formData.status === option.value ? option.bg + " " + option.color : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"
                      )}>
                         <option.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <p className={cn(
                           "text-[10px] font-black uppercase tracking-widest",
                           formData.status === option.value ? "text-slate-800" : "text-slate-400"
                         )}>{option.value}</p>
                         <p className="text-[9px] font-medium text-slate-400 mt-0.5">Internal Gateway State</p>
                      </div>
                      {formData.status === option.value && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                           <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                   </button>
                ))}
             </div>
          </section>

          {/* Audit Disclaimer */}
          <section className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100 flex gap-4 text-left">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 shrink-0">
                <AlertCircle className="w-5 h-5" />
             </div>
             <div className="space-y-1">
                <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Financial Integrity Note</h4>
                <p className="text-[11px] font-medium text-emerald-800/70 leading-relaxed italic">
                  Modification of transaction status is logged and audited. Core financial values (Amount, Gateway Ref) are strictly immutable to maintain PCI-DSS compatibility.
                </p>
             </div>
          </section>

          {/* Technical Hash View */}
          <section className="space-y-3 text-left">
             <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gateway Reference Hash</span>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-400 break-all select-all hover:bg-slate-100/50 transition-colors">
                {transaction.id}
             </div>
          </section>
        </div>

        {/* Footer - Standardized Professional Dashboard Footer */}
        <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={onClose}
             disabled={isSaving}
             className="px-6 py-2.5 text-[11px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={cn(
               "px-8 py-2.5 bg-emerald-600 text-white text-[11px] font-black rounded-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-emerald-500/10 uppercase tracking-widest",
               isSaving && "opacity-70 cursor-not-allowed scale-[0.98]"
             )}
           >
             {isSaving ? (
               <>
                 <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Synchronizing...</span>
               </>
             ) : (
               <>
                 <Save className="w-4 h-4" />
                 <span>Commit Changes</span>
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
}
