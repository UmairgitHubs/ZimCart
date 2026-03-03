"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Archive } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface DeleteInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: InventoryItem | null;
  isLoading?: boolean;
}

export function DeleteInventoryModal({ isOpen, onClose, onConfirm, item, isLoading = false }: DeleteInventoryModalProps) {

  if (!isOpen || !item) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={isLoading ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
           Delete Product?
        </h3>
        
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-slate-800">"{item.productName}"</span>? 
          This will permanently remove the product from the inventory and catalog. This action cannot be undone.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2",
              isLoading && "opacity-70 cursor-not-allowed scale-[0.98]"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
