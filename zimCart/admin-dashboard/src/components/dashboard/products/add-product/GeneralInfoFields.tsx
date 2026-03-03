import React from "react";
import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function GeneralInfoFields() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Info className="w-4 h-4 text-emerald-600" />
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">General Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Product Name *</label>
          <input 
            {...register("name")}
            placeholder="E.g. Wireless Noise Canceling Headphones" 
            className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
          />
          {errors.name && <p className="text-[11px] text-red-500 mt-1">{(errors.name as any).message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Brand *</label>
          <input 
            {...register("brand")}
            placeholder="E.g. Sony, Apple, Nike" 
            className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.brand ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
          />
          {errors.brand && <p className="text-[11px] text-red-500 mt-1">{(errors.brand as any).message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500">Description *</label>
        <textarea 
          {...register("description")}
          placeholder="Give a detailed description of the product..." 
          rows={3}
          className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all resize-none`}
        />
        {errors.description && <p className="text-[11px] text-red-500 mt-1">{(errors.description as any).message}</p>}
      </div>
    </div>
  );
}
