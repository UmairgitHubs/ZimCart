"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, UserX } from "lucide-react";
import { Customer } from "@/types/customers";
import { cn } from "@/lib/utils";

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customer: Customer) => void;
  customer: Customer | null;
}

export function DeleteCustomerModal({ isOpen, onClose, onConfirm, customer }: DeleteCustomerModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConfirm(customer);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={isDeleting ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm">
          <UserX className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
           <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Remove Customer?
           </h3>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                 Registry ID: {customer.id}
              </span>
           </div>
        </div>
        
        <p className="text-slate-500 mt-4 text-sm font-medium leading-relaxed">
          Are you sure you want to delete <span className="font-extrabold text-slate-800">"{customer.name}"</span>? 
          This will permanently purge this user's profile, transaction history links, and communication logs. This action is <span className="text-red-600 font-bold underline decoration-red-200 underline-offset-4">irrevocable</span>.
        </p>

        <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl mt-6 flex items-start gap-3">
           <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
           <p className="text-[11px] font-bold text-red-700 leading-normal">
             Purging a profile will sever all historical API links. We recommend "Blocking" the user instead if you wish to retain data integrity for audits.
           </p>
        </div>
        
        <div className="flex items-center gap-3 mt-8">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-4 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Abort
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
               "flex-[1.5] py-4 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2",
               isDeleting && "opacity-70 cursor-not-allowed scale-[0.98]"
            )}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Purging...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Purge Records</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
