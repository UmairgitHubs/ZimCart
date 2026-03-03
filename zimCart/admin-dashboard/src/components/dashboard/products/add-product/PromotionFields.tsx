import React from "react";
import { Sparkles, Percent } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function PromotionFields() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Promotions & Deals</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flash Deal</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register("isDeal")} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      <div className="p-5 bg-slate-50 border border-slate-200 rounded-[24px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-slate-700">Display Discount Badge</p>
            <p className="text-[11px] font-medium text-slate-500">Shows a percentage off badge on the product image.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
             <Percent className="w-4 h-4 text-emerald-500" />
             <input 
               type="number" 
               {...register("discountPercentage", { valueAsNumber: true })}
               className="w-12 text-center text-sm font-black text-slate-800 outline-none"
               placeholder="0"
             />
             <span className="text-xs font-bold text-slate-400">OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
