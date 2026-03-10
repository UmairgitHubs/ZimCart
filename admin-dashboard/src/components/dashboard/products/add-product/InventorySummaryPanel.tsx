"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";

export function InventorySummaryPanel() {
  const { watch } = useFormContext();
  const variants = watch("variants") || [];
  const baseUnit = watch("baseUnit") || "piece";

  const totalStock = variants.reduce((sum: number, v: any) => {
    if (v.isActive) {
      return sum + (Number(v.stockQuantity || 0) * Number(v.baseUnitQuantity || 1));
    }
    return sum;
  }, 0);

  const activeCount = variants.filter((v: any) => v.isActive).length;

  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
          <Info className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Summary</p>
          <div className="flex items-center gap-4 mt-0.5">
            <span className="text-sm font-black text-slate-800">
               Total Stock: {totalStock} {baseUnit}
            </span>
            <span className="text-sm font-medium text-slate-500 border-l border-slate-200 pl-4">
               {activeCount} {activeCount === 1 ? 'Variant' : 'Variants'} active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
