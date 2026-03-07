"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  PackageMinus, 
  AlertOctagon, 
  CircleDot, 
  Info, 
  Database,
  TrendingDown,
  Save,
  Box,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { WasteLogEntry, WasteReason } from "@/types/waste";
import { cn } from "@/lib/utils";

interface EditWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedLog: WasteLogEntry) => void;
  log: WasteLogEntry | null;
}

export function EditWasteModal({ isOpen, onClose, onConfirm, log }: EditWasteModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<WasteLogEntry>>({});

  useEffect(() => {
    if (log) {
      setFormData(log);
    }
  }, [log]);

  if (!isOpen || !log) return null;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm({ ...log, ...formData } as WasteLogEntry);
    setIsSaving(false);
    onClose();
  };

  const reasons: { value: WasteReason; icon: any; color: string; bg: string; border: string }[] = [
    { value: 'Expired', icon: AlertOctagon, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { value: 'Damaged', icon: CircleDot, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
    { value: 'Leaked', icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    { value: 'Spoilage', icon: TrendingDown, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { value: 'Lost', icon: Database, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={isSaving ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
              <PackageMinus className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Adjust Log Entry</h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{log.id} — {log.sku}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-left">
             <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Product Designation</p>
                <p className="text-sm font-semibold text-slate-700">{log.productName}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Impacted Category</p>
                <p className="text-sm font-semibold text-slate-700">{log.category}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
             <div className="space-y-3">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Override Reason</label>
                <div className="flex flex-wrap gap-2">
                   {reasons.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setFormData({ ...formData, reason: r.value })}
                        className={cn(
                          "px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2",
                          formData.reason === r.value 
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                         <r.icon className="w-3.5 h-3.5" />
                         {r.value}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Adjustment Meta</label>
                <div className="grid grid-cols-2 gap-3">
                   <div className="relative group">
                      <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      <input 
                        type="number"
                        value={formData.quantity || ""}
                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-rose-500 transition-all font-bold"
                        placeholder="Qty"
                      />
                   </div>
                   <div className="relative group">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                      <input 
                        type="number"
                        value={formData.unitCost || ""}
                        onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-rose-500 transition-all font-bold"
                        placeholder="Cost"
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-3 text-left">
             <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Narrative Refinement</label>
             <textarea 
               value={formData.notes || ""}
               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
               className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 focus:bg-white focus:border-rose-500 transition-all outline-none resize-none min-h-[100px]"
               placeholder="Update narrative..."
             />
          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex items-start gap-4 text-left italic">
             <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
             <p className="text-[10px] font-medium text-amber-800/70 leading-relaxed">
               Note: Adjusting quantity or unit cost will automatically recalculate the Total Loss Impact for this record. Operational logs will track this manual override.
             </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={onClose}
             disabled={isSaving}
             className="px-6 py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
           >
             Dismiss
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={cn(
               "px-8 py-2.5 bg-emerald-600 text-white text-[11px] font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-slate-200 uppercase tracking-widest",
               isSaving && "opacity-70 cursor-not-allowed scale-[0.98]"
             )}
           >
             {isSaving ? (
               <>
                 <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Syncing...</span>
               </>
             ) : (
               <>
                 <Save className="w-4 h-4" />
                 <span>Apply Override</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
