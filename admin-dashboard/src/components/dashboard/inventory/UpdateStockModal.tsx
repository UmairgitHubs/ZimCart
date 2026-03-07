"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Package, Minus, Plus, 
  CheckCircle2, ArrowRight, ShieldCheck,
  TrendingDown, Info
} from "lucide-react";
import Image from "next/image";
import { InventoryItem } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (itemId: string, newStock: number, reason: string) => void;
  item: InventoryItem | null;
}

export function UpdateStockModal({ isOpen, onClose, onConfirm, item }: UpdateStockModalProps) {
  const [newStock, setNewStock] = useState(0);
  const [reason, setReason] = useState("Restock");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (item) {
      setNewStock(item.availableStock);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm(item.id, newStock, reason);
    setIsUpdating(false);
    onClose();
  };

  const adjustment = newStock - item.availableStock;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" 
        onClick={isUpdating ? undefined : onClose} 
      />
      
      {/* Modal Dialog - Matching CategoryDetailsModal exact structure */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Package className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Stock Adjustment</h2>
              <p className="text-[11px] font-medium text-slate-400">Auditing {item.sku} at {item.warehouseLocation}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Top Section: Image and Basic Item Info */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden shrink-0 shadow-inner">
               {item.image ? (
                 <Image src={item.image} alt={item.productName} fill className="object-cover" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                   <Package className="w-10 h-10" />
                 </div>
               )}
            </div>
            
            <div className="flex-1 space-y-4 pt-1">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{item.productName}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-400 border-slate-100">
                      ID: {item.id}
                    </span>
                    <span className={cn(
                      "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {item.status}
                    </span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Stock</p>
                     <p className="text-sm font-bold text-slate-700">{item.availableStock} PCS</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Restock Level</p>
                     <p className="text-sm font-bold text-slate-700">{item.restockThreshold} Units</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Adjustment Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
             {/* Left: Controls */}
             <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Inventory Level</label>
                   <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner">
                      <button 
                        onClick={() => setNewStock(Math.max(0, newStock - 1))}
                        className="w-12 h-12 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 transition-all active:scale-90 shadow-sm"
                        title="Decrease"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <input 
                          type="number" 
                          value={newStock}
                          onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent border-0 text-center text-3xl font-black text-slate-900 focus:ring-0 p-0"
                        />
                        <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tighter">Units</p>
                      </div>
                      <button 
                        onClick={() => setNewStock(newStock + 1)}
                        className="w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-all active:scale-90 shadow-lg shadow-emerald-200/50"
                        title="Increase"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Adjustment Reason</label>
                   <div className="grid grid-cols-2 gap-2">
                     {["Restock", "Audit", "Damage", "Return"].map((r) => (
                       <button
                         key={r}
                         onClick={() => setReason(r)}
                         className={cn(
                           "px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                           reason === r 
                             ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200/50" 
                             : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                         )}
                       >
                         {r}
                       </button>
                     ))}
                   </div>
                </div>
             </div>

             {/* Right: Summary Preview */}
             <div className="bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Summary</p>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-black uppercase",
                      adjustment > 0 ? "bg-emerald-500 text-white" : adjustment < 0 ? "bg-red-500 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {adjustment > 0 ? "Inbound" : adjustment < 0 ? "Outbound" : "No Change"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">From</p>
                       <p className="text-lg font-black text-slate-800">{item.availableStock}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-emerald-100 text-emerald-500 shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">To</p>
                       <p className="text-xl font-black text-emerald-600">{newStock}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-start gap-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                   <p className="text-[11px] font-medium text-emerald-800/70 leading-normal italic">
                     Registry adjustment of {adjustment > 0 ? `+${adjustment}` : adjustment} units will be logged for {reason}.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={onClose}
             disabled={isUpdating}
             className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleUpdate}
             disabled={isUpdating}
             className={cn(
               "px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200/50",
               isUpdating && "opacity-70 cursor-not-allowed"
             )}
           >
             {isUpdating ? (
               <>
                 <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Processing...</span>
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Save Adjustment</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
