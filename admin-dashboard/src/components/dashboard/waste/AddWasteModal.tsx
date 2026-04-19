"use client";

import React, { useState } from "react";
import { 
  X, 
  PackageMinus, 
  Search, 
  Trash2, 
  AlertOctagon, 
  DollarSign, 
  Box, 
  Info, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingDown,
  CircleDot,
  Type,
  Database
} from "lucide-react";
import { WasteLogEntry, WasteReason } from "@/types/waste";
import { cn } from "@/lib/utils";

interface AddWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newLog: WasteLogEntry) => Promise<void>;
}

export function AddWasteModal({ isOpen, onClose, onConfirm }: AddWasteModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    category: "Groceries",
    quantity: 0,
    unitCost: 0,
    reason: 'Damaged' as WasteReason,
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.productName.trim()) newErrors.productName = "Product identification required";
    if (!formData.sku.trim()) newErrors.sku = "SKU mapping required";
    if (formData.quantity <= 0) newErrors.quantity = "Quantity must be > 0";
    if (formData.unitCost <= 0) newErrors.unitCost = "Cost mapping required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const newLog: WasteLogEntry = {
        id: `WL-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
        productId: "",
        productName: formData.productName,
        sku: formData.sku.toUpperCase(),
        category: formData.category,
        quantity: formData.quantity,
        unitCost: formData.unitCost,
        totalLoss: formData.quantity * formData.unitCost,
        reason: formData.reason,
        loggedBy: "Admin Portal",
        timestamp: new Date().toISOString(),
        notes: formData.notes
      };
      await onConfirm(newLog);
      resetAndClose();
    } finally {
      setIsSaving(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      productName: "",
      sku: "",
      category: "Groceries",
      quantity: 0,
      unitCost: 0,
      reason: 'Damaged',
      notes: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const reasons: { value: WasteReason; icon: any; color: string; bg: string; border: string }[] = [
    { value: 'Expired', icon: AlertOctagon, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { value: 'Damaged', icon: CircleDot, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
    { value: 'Leaked', icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    { value: 'Spoilage', icon: TrendingDown, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { value: 'Lost', icon: Database, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={isSaving ? undefined : resetAndClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm shadow-rose-500/5">
              <PackageMinus className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Asset Write-Off</h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Initialize inventory shrinkage</p>
            </div>
          </div>
          <button 
            onClick={resetAndClose}
            disabled={isSaving}
            className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12 custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            
            {/* Left: Product Selection & Identity */}
            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                     <Search className="w-4 h-4 text-rose-600" />
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Identification</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Product Designation</label>
                       <div className="relative group">
                          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                          <input 
                            type="text"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            className={cn(
                              "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-rose-500 transition-all shadow-sm",
                              errors.productName && "border-red-200 bg-red-50/30"
                            )}
                            placeholder="Enter product name..."
                          />
                       </div>
                       {errors.productName && <p className="text-[9px] font-bold text-red-500 uppercase ml-1 tracking-wider">{errors.productName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Asset SKU</label>
                          <input 
                            type="text"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            className={cn(
                              "w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 tracking-wider outline-none focus:bg-white focus:border-rose-500 transition-all",
                              errors.sku && "border-red-200 bg-red-50/30"
                            )}
                            placeholder="SKU-REF-00"
                          />
                          {errors.sku && <p className="text-[9px] font-bold text-red-500 uppercase ml-1 tracking-wider">{errors.sku}</p>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                          <select 
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-rose-500 transition-all appearance-none"
                          >
                             <option>Groceries</option>
                             <option>Produce</option>
                             <option>Electronics</option>
                             <option>Fashion</option>
                             <option>Dairy</option>
                             <option>Bakery</option>
                          </select>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                     <AlertOctagon className="w-4 h-4 text-rose-600" />
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Reason Classification</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     {reasons.map((r) => (
                        <button
                          key={r.value}
                          onClick={() => setFormData({ ...formData, reason: r.value })}
                          className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-[24px] border transition-all active:scale-95 text-center",
                            formData.reason === r.value 
                              ? "bg-white border-rose-500 shadow-xl shadow-rose-500/5 ring-1 ring-rose-500/20" 
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200"
                          )}
                        >
                           <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                             formData.reason === r.value ? r.bg + " " + r.color : "bg-white text-slate-200"
                           )}>
                              <r.icon className="w-5 h-5" />
                           </div>
                           <span className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             formData.reason === r.value ? "text-slate-800" : "text-slate-400"
                           )}>{r.value}</span>
                           {formData.reason === r.value && (
                             <div className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                             </div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right: Economics & Narrative */}
            <div className="space-y-8">
               <div className="p-8 bg-rose-50/30 rounded-[32px] border border-rose-100/50 space-y-8 relative overflow-hidden">
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">Quantity Lost</label>
                        <div className="relative group">
                           <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300 group-focus-within:text-rose-600 transition-colors" />
                           <input 
                             type="number"
                             value={formData.quantity || ""}
                             onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                             className={cn(
                               "w-full pl-11 pr-4 py-4 bg-white border border-rose-100 rounded-2xl text-lg font-black text-slate-800 outline-none focus:border-rose-500 transition-all",
                               errors.quantity && "border-red-300"
                             )}
                             placeholder="0"
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">Asset Value (Unit)</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300 group-focus-within:text-rose-600 transition-colors" />
                           <input 
                             type="number"
                             value={formData.unitCost || ""}
                             onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                             className={cn(
                               "w-full pl-11 pr-4 py-4 bg-white border border-rose-100 rounded-2xl text-lg font-black text-slate-800 outline-none focus:border-rose-500 transition-all",
                               errors.unitCost && "border-red-300"
                             )}
                             placeholder="0.00"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-rose-100 flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Calculated Write-Off</p>
                        <p className="text-2xl font-bold text-rose-600 tracking-tighter tabular-nums underline decoration-rose-500/10 underline-offset-4">
                          ${(formData.quantity * formData.unitCost).toFixed(2)}
                        </p>
                     </div>
                     <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 rotate-12">
                        <TrendingDown className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[60px] rounded-full -z-0"></div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Operational Narrative</h4>
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Optional Internal Ref</span>
                  </div>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium text-slate-600 focus:bg-white focus:border-rose-500 transition-all outline-none resize-none min-h-[140px]"
                    placeholder="Describe the context of this write-off event (e.g. aisle leakage, expiry sweep, etc...)"
                  />
               </div>
            </div>
          </div>
          
          {/* Bottom Compliance Box */}
          <div className="p-6 bg-amber-50/50 rounded-[28px] border border-amber-100/50 flex items-start gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-amber-100 shrink-0">
                <Info className="w-5 h-5 text-amber-500" />
             </div>
             <div>
                <h4 className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">Stock Integrity Protocol</h4>
                <p className="text-[11px] font-medium text-amber-800/70 leading-relaxed italic">
                  This transaction will immediately deduct quantity from the master inventory table. Ensure all physical items are removed before committing this write-off to the active ledger.
                </p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={resetAndClose}
             disabled={isSaving}
             className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
           >
             Abort Entry
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={cn(
               "px-10 py-3.5 bg-rose-600 text-white text-xs font-black rounded-2xl hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-rose-200 uppercase tracking-widest",
               isSaving && "opacity-70 cursor-not-allowed scale-[0.98]"
             )}
           >
             {isSaving ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Writing Off...</span>
               </>
             ) : (
               <>
                 <ArrowUpRight className="w-5 h-5" />
                 <span>Commit Write-Off</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
