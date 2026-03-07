import React from "react";
import { DollarSign, Percent, Package, Layers } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function PricingIdentifierFields() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Column 1: Pricing */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Pricing</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Selling Price *</label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00" 
                className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
              />
            </div>
            {errors.price && <p className="text-[11px] text-red-500 mt-1">{(errors.price as any).message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Discount Price</label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number"
                step="0.01"
                {...register("discountPrice", { valueAsNumber: true })}
                placeholder="0.00" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Cost Price</label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number"
                step="0.01"
                {...register("costPrice", { valueAsNumber: true })}
                placeholder="0.00" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Tax (%)</label>
            <div className="relative">
              <Percent className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number"
                step="0.1"
                {...register("taxPercentage", { valueAsNumber: true })}
                placeholder="0.0" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Inventory Level *</label>
            <div className="relative">
              <Package className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="number"
                {...register("inventory", { valueAsNumber: true })}
                placeholder="0" 
                className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border ${errors.inventory ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
              />
            </div>
            {errors.inventory && <p className="text-[11px] text-red-500 mt-1">{(errors.inventory as any).message}</p>}
          </div>
        </div>
      </div>

      {/* Column 2: Identifiers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-emerald-600" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Identifiers</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">SKU *</label>
            <input 
              {...register("sku")}
              placeholder="E.g. WH-1000" 
              className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.sku ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
            />
            {errors.sku && <p className="text-[11px] text-red-500 mt-1">{(errors.sku as any).message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Barcode</label>
            <input 
              {...register("barcode")}
              placeholder="E.g. 123456789" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">Weight (KG)</label>
            <input 
              {...register("weight")}
              placeholder="E.g. 0.5" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
