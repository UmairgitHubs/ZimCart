"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  Tag, 
  Calendar, 
  CheckCircle2,
  DollarSign,
  Percent,
  Truck,
  Hash,
  Activity,
  Type,
  Briefcase,
  Zap
} from "lucide-react";
import { Promotion, DiscountType, PromotionStatus } from "@/types/promotions";
import { cn } from "@/lib/utils";

interface EditPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedPromo: Promotion) => void;
  promotion: Promotion | null;
}

export function EditPromotionModal({ isOpen, onClose, onConfirm, promotion }: EditPromotionModalProps) {
  const [formData, setFormData] = useState<Partial<Promotion>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name,
        code: promotion.code,
        description: promotion.description,
        type: promotion.type,
        value: promotion.value,
        minPurchase: promotion.minPurchase,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        usageLimit: promotion.usageLimit,
        status: promotion.status,
        targetCategory: promotion.targetCategory || "All Categories"
      });
    }
  }, [promotion]);

  if (!isOpen || !promotion) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Campaign name is required";
    if (formData.value !== undefined && formData.value <= 0 && formData.type !== 'Free Shipping') {
      newErrors.value = "Value must be greater than zero";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm({ ...promotion, ...formData } as Promotion);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" 
        onClick={isSaving ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Settings className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Edit Campaign</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Modify parameters for {promotion.code}</p>
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
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            <div className="space-y-8">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Label</label>
                  {errors.name && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.name}</span>}
                </div>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                      errors.name && "border-red-200 bg-red-50/30"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lifecycle Status</label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PromotionStatus })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none shadow-sm"
                  >
                    <option value="Active">Active & Deployable</option>
                    <option value="Scheduled">Scheduled for Future</option>
                    <option value="Expired">Manual Expiration</option>
                    <option value="Disabled">Disabled / Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Campaign Narrative</label>
                <textarea 
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm min-h-[120px] resize-none"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Discount Architecture</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Percent, label: "Percentage", val: "Percentage" },
                      { icon: DollarSign, label: "Fixed", val: "Fixed Amount" },
                      { icon: Truck, label: "Shipping", val: "Free Shipping" },
                    ].map((t) => (
                      <button
                        key={t.val}
                        onClick={() => setFormData({ ...formData, type: t.val as DiscountType })}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95",
                          formData.type === t.val 
                            ? "bg-white border-emerald-500 text-emerald-600 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <t.icon className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.type !== 'Free Shipping' && (
                  <div className="space-y-2.5 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount Benefit</label>
                      {errors.value && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.value}</span>}
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                         {formData.type === 'Percentage' ? <Percent className="w-4 h-4 text-emerald-500" /> : <DollarSign className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <input 
                        type="number" 
                        value={formData.value || ""}
                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-emerald-100 rounded-2xl text-sm font-black text-slate-700 outline-none shadow-sm focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Launch</label>
                    <input 
                      type="date" 
                      value={formData.startDate ? formData.startDate.split('T')[0] : ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Termination</label>
                    <input 
                      type="date" 
                      value={formData.endDate ? formData.endDate.split('T')[0] : ""}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-4">
           <button 
             onClick={onClose}
             disabled={isSaving}
             className="px-8 py-3 text-xs font-black text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest"
           >
             Cancel
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={cn(
               "px-10 py-3.5 bg-emerald-600 text-white text-xs font-black rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-emerald-500/20 uppercase tracking-widest",
               isSaving && "opacity-70 cursor-not-allowed scale-[0.98]"
             )}
           >
             {isSaving ? (
               <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>Updating...</span>
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-5 h-5" />
                 <span>Sync Changes</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
