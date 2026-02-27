"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Bike, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Camera,
  AlertCircle,
  Hash,
  Star,
  Settings,
  Mail,
  Fingerprint,
  Building2
} from "lucide-react";
import Image from "next/image";
import { Rider } from "@/types/riders";
import { cn } from "@/lib/utils";

interface EditRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedRider: Rider) => void;
  rider: Rider | null;
}

export function EditRiderModal({ isOpen, onClose, onConfirm, rider }: EditRiderModalProps) {
  const [formData, setFormData] = useState<Partial<Rider>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name,
        email: rider.email,
        phone: rider.phone,
        idNumber: rider.idNumber,
        status: rider.status,
        vehicleType: rider.vehicleType,
        licensePlate: rider.licensePlate,
        assignedHub: rider.assignedHub,
      });
    }
  }, [rider]);

  if (!isOpen || !rider) return null;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm({ ...rider, ...formData } as Rider);
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
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Settings className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Admin Profile Modification</h2>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Fleet Terminal: {rider.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group shrink-0 mx-auto md:mx-0">
               <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden shadow-inner">
                  {rider.avatarUrl ? (
                    <Image src={rider.avatarUrl} alt={rider.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                      <Bike className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                     <Camera className="w-5 h-5 text-white" />
                  </div>
               </div>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Record Name</label>
                  <input 
                    type="text" 
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Operational Status</label>
                  <select 
                    value={formData.status || "Offline"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                  >
                    <option value="Available">Available for Dispatch</option>
                    <option value="Dispatched">Currently on Delivery</option>
                    <option value="Offline">Offline / Unavailable</option>
                    <option value="Banned">Suspended / Policy Review</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identity</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email" 
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gov ID / Lic. Number</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={formData.idNumber || ""}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Classification</label>
                <input 
                  type="text" 
                  value={formData.vehicleType || ""}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Plate</label>
                <input 
                  type="text" 
                  value={formData.licensePlate || ""}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none uppercase"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Operational Hub</label>
                <div className="relative">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <select 
                    value={formData.assignedHub || ""}
                    onChange={(e) => setFormData({ ...formData, assignedHub: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none"
                  >
                    <option value="Harare Main Hub">Harare Main Hub (HQ)</option>
                    <option value="Bulawayo Central Hub">Bulawayo Central Hub</option>
                    <option value="Mutare Regional Hub">Mutare Regional Hub</option>
                    <option value="Gweru Hub">Gweru Specialized Hub</option>
                  </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Emergency Dispatch Line</label>
                <input 
                  type="text" 
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                />
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
                 <span>Saving...</span>
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-5 h-5" />
                 <span>Save Changes</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
