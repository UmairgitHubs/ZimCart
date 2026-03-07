import React from "react";
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  Loader2,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/products";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product: Product | null;
  isDeleting: boolean;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  product,
  isDeleting
}: DeleteProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        {/* Header Decor */}
        <div className="h-2 w-full bg-red-500" />
        
        <div className="p-8">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-20 h-20 bg-red-50 rounded-[28px] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-[28px] animate-ping" />
              <Trash2 className="w-10 h-10 text-red-500 relative z-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Purge Item?</h3>
              <p className="text-slate-500 font-medium text-sm mt-1 px-4">
                This action is destructive and cannot be reversed from the cloud.
              </p>
            </div>
          </div>

          {/* Product Preview Card */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-slate-100">
            <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
               {product.images[0] ? (
                 <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <AlertTriangle className="w-6 h-6 text-slate-300" />
                 </div>
               )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">SKU: {product.sku}</p>
               <p className="text-sm font-bold text-slate-700 truncate">{product.name}</p>
            </div>
          </div>

          {/* Security Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
             <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
             <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
               By confirming, you acknowledge that all sales history and inventory records for this SKU will be permanently archived.
             </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>Purge Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
