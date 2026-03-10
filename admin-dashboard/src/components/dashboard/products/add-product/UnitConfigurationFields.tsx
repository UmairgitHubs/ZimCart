import React from "react";
import { Ruler } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function UnitConfigurationFields() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Ruler className="w-4 h-4 text-emerald-600" />
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Unit Configuration</h3>
      </div>

      <div className="space-y-1.5 max-w-sm">
        <label className="text-xs font-bold text-slate-500">Base Unit — how this product is tracked in stock *</label>
        <select
          {...register("baseUnit")}
          className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.baseUnit ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white transition-all`}
        >
          <option value="piece">piece</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="litre">litre</option>
          <option value="ml">ml</option>
          <option value="metre">metre</option>
          <option value="box">box</option>
        </select>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          This unit is used to calculate total store inventory. E.g. if you set kg, you can sell in 2kg or 500g variants while tracking total weight.
        </p>
        {errors.baseUnit && <p className="text-[11px] text-red-500 mt-1">{(errors.baseUnit as any).message}</p>}
      </div>
    </div>
  );
}
