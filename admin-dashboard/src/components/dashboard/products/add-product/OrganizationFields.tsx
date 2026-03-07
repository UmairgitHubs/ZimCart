import React, { useMemo } from "react";
import { List, Layers } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/categories";

export function OrganizationFields() {
  const { register, control, formState: { errors } } = useFormContext();
  const statusWatch = useWatch({ control, name: "status" });
  const categoryWatch = useWatch({ control, name: "category" });

  // Fetch real categories from backend
  const { data: categoriesResponse } = useCategories();
  
  const categories: Category[] = useMemo(() => {
    const apiPayload = categoriesResponse?.data?.data || categoriesResponse?.data;
    return apiPayload?.items || (Array.isArray(apiPayload) ? apiPayload : []);
  }, [categoriesResponse]);

  // Derived: Parent Categories (those with no parentCategoryId)
  const parentCategories = useMemo(() => 
    categories.filter(cat => !cat.parentCategoryId), 
  [categories]);

  // Derived: Sub-categories for the currently selected parent
  const subCategories = useMemo(() => {
    if (!categoryWatch) return [];
    // Find the parent ID by name (current backend expects names as values)
    const selectedParent = parentCategories.find(p => p.name === categoryWatch);
    if (!selectedParent) return [];
    
    return categories.filter(cat => cat.parentCategoryId === selectedParent.id);
  }, [categoryWatch, categories, parentCategories]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <List className="w-4 h-4 text-emerald-600" />
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Organization</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <select 
              {...register("category")}
              className={`w-full px-4 py-3 bg-slate-50/50 border-2 ${errors.category ? 'border-red-200' : 'border-slate-100 focus:border-emerald-500/30 focus:bg-white'} rounded-2xl text-[13px] font-bold text-slate-700 outline-none transition-all cursor-pointer appearance-none pr-10`}
            >
              <option value="">Select Category</option>
              {parentCategories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
               <Layers className="w-4 h-4" />
            </div>
          </div>
          {errors.category && <p className="text-[11px] text-red-500 mt-1 font-bold">{(errors.category as any).message}</p>}
        </div>

        {/* Dynamic Sub-Category Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Sub-Category</label>
          {subCategories.length > 0 ? (
            <div className="relative group">
              <select 
                {...register("subCategory")}
                className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-100 focus:border-emerald-500/30 focus:bg-white rounded-2xl text-[13px] font-bold text-slate-700 outline-none transition-all cursor-pointer appearance-none pr-10"
              >
                <option value="">None / Select Sub-Category</option>
                {subCategories.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                 <List className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <input 
              {...register("subCategory")}
              placeholder={categoryWatch ? "E.g. Wireless" : "Select a category first..."} 
              disabled={!categoryWatch}
              className="w-full px-4 py-3 bg-slate-50/50 border-2 border-slate-100 focus:border-emerald-500/30 focus:bg-white rounded-2xl text-[13px] font-bold text-slate-700 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Initial Status</label>
          <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl h-[42px]">
             {['Draft', 'In Stock'].map((s) => (
               <label 
                  key={s}
                  className={`flex-1 flex items-center justify-center h-full rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                    statusWatch === s ? "bg-white text-slate-800 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-500"
                  }`}
               >
                  <input type="radio" className="hidden" value={s} {...register("status")} />
                  {s}
               </label>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
