import React from "react";
import { List, Plus, Trash2 } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";

export function VariantFields() {
  const { register, control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-emerald-600" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Product Variants</h3>
        </div>
        <button 
          type="button"
          onClick={() => append({ type: "", values: [] })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Variant</span>
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                <input 
                  {...register(`variants.${index}.type` as const)}
                  placeholder="E.g. Size, Color, Material"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Values (Comma Separated)</label>
                <input 
                  placeholder="E.g. S, M, L or Red, Blue"
                  onChange={(e) => {
                    const vals = e.target.value.split(",").map(v => v.trim()).filter(v => v !== "");
                    setValue(`variants.${index}.values`, vals, { shouldValidate: true });
                  }}
                  defaultValue={(field as any).values.join(", ")}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => remove(index)}
              className="mt-6 p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="py-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
             <p className="text-[11px] font-medium text-slate-400">No variants added. Click "Add Variant" for size/color options.</p>
          </div>
        )}
      </div>
    </div>
  );
}
