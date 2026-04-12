"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Promotion } from "@/types/promotions";
import { cn } from "@/lib/utils";

interface DeletePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  promotion: Promotion | null;
}

export function DeletePromotionModal({
  isOpen,
  onClose,
  onConfirm,
  promotion,
}: DeletePromotionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !promotion) return null;

  const handleConfirm = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={isDeleting ? undefined : onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
          Terminate promotion?
        </h3>

        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          Delete{" "}
          <span className="font-bold text-slate-800">
            &quot;{promotion.name}&quot; ({promotion.code})
          </span>
          ? Customer redemptions for this voucher will be removed from history linkage.
        </p>

        {error && (
          <p className="mt-4 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mt-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-amber-700 leading-normal">
            This cannot be undone. Codes will stop working at checkout immediately.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-all active:scale-95 uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={cn(
              "flex-[1.5] py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest",
              isDeleting && "opacity-70 cursor-not-allowed scale-[0.98]"
            )}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
