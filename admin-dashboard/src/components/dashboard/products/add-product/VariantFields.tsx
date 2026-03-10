"use client";

import React, { useState } from "react";
import { 
  List, Plus, Trash2, ChevronDown, ChevronUp, 
  RefreshCw, Camera, Search, AlertCircle, CheckCircle2 
} from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { generateSKU } from "@/lib/utils/sku-generator";
import { BarcodeScannerModal } from "./BarcodeScannerModal";
import axios from "axios";

export function VariantFields() {
  const { register, control, setValue, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeScannerIndex, setActiveScannerIndex] = useState<number | null>(null);

  const baseUnit = watch("baseUnit");
  const category = watch("category");
  const brand = watch("brand");

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAutoGenerateSKU = (index: number) => {
    const variantName = watch(`variants.${index}.name`);
    const newSku = generateSKU(category, brand, variantName);
    setValue(`variants.${index}.sku`, newSku, { shouldValidate: true });
  };

  const openScanner = (index: number) => {
    setActiveScannerIndex(index);
    setIsScannerOpen(true);
  };

  const handleScanSuccess = async (barcode: string) => {
    if (activeScannerIndex !== null) {
      setValue(`variants.${activeScannerIndex}.barcode`, barcode, { shouldValidate: true });
      // Trigger lookup logic (this will be handled by the parent component or via a callback)
      // For now, satisfy the requirement of "Populate and trigger lookup"
      triggerBarcodeLookup(barcode, activeScannerIndex);
    }
    setIsScannerOpen(false);
  };

  const triggerBarcodeLookup = async (barcode: string, index: number) => {
     // This logic will likely update top-level fields too as per requirement.
     // We'll expose a custom event or use a hook to handle this globally in AddProductModal
     window.dispatchEvent(new CustomEvent('barcode-lookup', { detail: { barcode, index } }));
  };

  const handleDefaultToggle = (index: number) => {
    fields.forEach((_, i) => {
      setValue(`variants.${i}.isDefault`, i === index);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-emerald-600" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Product Variants</h3>
        </div>
        {fields.length < 10 && (
          <button 
            type="button"
            onClick={() => {
              const newIndex = fields.length;
              append({ 
                name: "", 
                sellingUnit: "piece", 
                baseUnitQuantity: 1, 
                sku: "", 
                costPrice: 0, 
                sellingPrice: 0, 
                stockQuantity: 0, 
                lowStockThreshold: 10,
                isDefault: fields.length === 0,
                isActive: true 
              });
              setExpandedIndex(newIndex);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all active:scale-95 shadow-sm shadow-emerald-500/5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Variant</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isExpanded = expandedIndex === index;
          const variantName = watch(`variants.${index}.name`) || "New Variant";
          const baseUnitQty = watch(`variants.${index}.baseUnitQuantity`) || 1;
          const variantSellingPrice = watch(`variants.${index}.sellingPrice`) || 0;
          const variantCostPrice = watch(`variants.${index}.costPrice`) || 0;
          const isDefault = watch(`variants.${index}.isDefault`);

          return (
            <div 
              key={field.id} 
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? 'border-emerald-200 ring-4 ring-emerald-500/5' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
            >
              {/* Card Header */}
              <div 
                className={`px-5 py-4 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-emerald-50/30' : 'bg-white'}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${isDefault ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <div>
                    <span className="text-sm font-bold text-slate-700">{variantName}</span>
                    {!isExpanded && (
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{watch(`variants.${index}.sku`) || "No SKU"}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Rs. {variantSellingPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {fields.length > 1 && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDefault && fields.length > 1) {
                           // Set another one as default before removing
                           const nextDefault = index === 0 ? 1 : 0;
                           handleDefaultToggle(nextDefault);
                        }
                        remove(index);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Card Body */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-50 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Variant Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Variant Name *</label>
                      <input 
                        {...register(`variants.${index}.name`)}
                        placeholder="e.g. 1kg Bag, 6-Pack"
                        className={`w-full px-4 py-2 bg-slate-50 border ${(errors.variants as any)?.[index]?.name ? 'border-red-300' : 'border-slate-200'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all`}
                      />
                      {(errors.variants as any)?.[index]?.name && (
                        <p className="text-[11px] text-red-500">{(errors.variants as any)[index].name.message}</p>
                      )}
                    </div>

                    {/* Selling Unit */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Selling Unit *</label>
                      <select
                        {...register(`variants.${index}.sellingUnit`)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      >
                        {["piece", "pack", "box", "bag", "kg", "g", "litre", "ml", "carton", "dozen"].map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Base Unit Quantity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Base Unit Quantity *</label>
                      <input 
                        type="number"
                        {...register(`variants.${index}.baseUnitQuantity`, { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                      <p className="text-[10px] text-emerald-600 font-bold mt-1">
                        1 {variantName} = {baseUnitQty} {baseUnit}
                      </p>
                    </div>

                    {/* SKU */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">SKU *</label>
                      <div className="relative group">
                        <input 
                          {...register(`variants.${index}.sku`)}
                          placeholder="BVRG-COKE-1KG-X7F2"
                          className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => handleAutoGenerateSKU(index)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Weight (KG)</label>
                      <input 
                        {...register(`variants.${index}.weight`)}
                        placeholder="e.g. 1.5"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white transition-all shadow-sm"
                      />
                    </div>

                    {/* Barcode */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Barcode</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            {...register(`variants.${index}.barcode`)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                triggerBarcodeLookup((e.target as HTMLInputElement).value, index);
                              }
                            }}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white transition-all shadow-sm"
                            placeholder="Scan or type barcode"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => openScanner(index)}
                          title="Open Camera Scanner"
                          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => triggerBarcodeLookup(watch(`variants.${index}.barcode`), index)}
                          title="Search Database"
                          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Quantity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Stock Quantity (base units) *</label>
                      <input 
                        type="number"
                        {...register(`variants.${index}.stockQuantity`, { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700"
                      />
                    </div>

                     {/* Low Stock Alert */}
                     <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Low Stock Alert *</label>
                      <input 
                        type="number"
                        {...register(`variants.${index}.lowStockThreshold`, { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                    {/* Cost Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Cost Price (PKR)</label>
                      <input 
                        type="number"
                        {...register(`variants.${index}.costPrice`, { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700"
                      />
                    </div>
                    {/* Selling Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Selling Price (PKR)</label>
                      <input 
                        type="number"
                        {...register(`variants.${index}.sellingPrice`, { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700"
                      />
                      {variantSellingPrice <= variantCostPrice && variantSellingPrice > 0 && (
                        <p className="flex items-center gap-1 text-[9px] text-amber-600 font-bold mt-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Margin is zero or negative
                        </p>
                      )}
                    </div>
                    {/* Discount Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Discount Price (PKR)</label>
                      <input 
                        type="number"
                        {...register(`variants.${index}.discountPrice`, { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register(`variants.${index}.isDefault`)}
                          onChange={() => handleDefaultToggle(index)}
                          disabled={fields.length === 1}
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Default Variant</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          {...register(`variants.${index}.isActive`)}
                        />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Active</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {fields.length === 0 && (
          <div 
            onClick={() => append({ name: "", sellingUnit: "piece", baseUnitQuantity: 1, sku: "", costPrice: 0, sellingPrice: 0, stockQuantity: 0, lowStockThreshold: 10, isDefault: true, isActive: true })}
            className="group py-12 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition-all duration-300"
          >
             <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-emerald-500/10 transition-all duration-300">
                <Plus className="w-6 h-6 text-emerald-500" />
             </div>
             <p className="text-[13px] font-bold text-slate-700 mt-4 tracking-tight">Add your first product variant</p>
             <p className="text-[11px] font-medium text-slate-400 mt-1">Variants are used for size, weight, or packaging options.</p>
          </div>
        )}
      </div>

      <BarcodeScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanSuccess}
      />
    </div>
  );
}
