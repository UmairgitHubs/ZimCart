"use client";

import React, { useState } from "react";
import { 
  X, 
  UserPlus, 
  Bike, 
  Phone, 
  Hash, 
  CheckCircle2,
  Camera,
  AlertCircle,
  ShieldCheck,
  Star,
  Globe,
  Mail,
  Building2,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rider } from "@/types/riders";

export type NewRiderPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  nationalId: string;
  vehicleType: string;
  licensePlate: string;
  homeBaseLabel: string;
  status: Rider["status"];
};

interface AddRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: NewRiderPayload) => Promise<void>;
}

export function AddRiderModal({ isOpen, onClose, onConfirm }: AddRiderModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    idNumber: "",
    vehicleType: "Motorcycle",
    licensePlate: "",
    assignedHub: "Harare Main Hub",
    status: "Available" as Rider["status"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Legal name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Contact phone is required";
    if (!formData.idNumber.trim()) newErrors.idNumber = "Gov ID / License number is required";
    if (!formData.licensePlate.trim() && formData.vehicleType !== "Standard Bike") {
      newErrors.licensePlate = "License plate required for motorized vehicles";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await onConfirm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        nationalId: formData.idNumber.trim(),
        vehicleType: formData.vehicleType,
        licensePlate: formData.licensePlate.trim() || "N/A",
        homeBaseLabel: formData.assignedHub,
        status: formData.status,
      });
      resetAndClose();
    } finally {
      setIsSaving(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      idNumber: "",
      vehicleType: "Motorcycle",
      licensePlate: "",
      assignedHub: "Harare Main Hub",
      status: "Available",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" 
        onClick={isSaving ? undefined : resetAndClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm shadow-emerald-500/5">
              <UserPlus className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Onboard New Rider</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Initialize Fleet Security Profile</p>
            </div>
          </div>
          <button 
            onClick={resetAndClose}
            disabled={isSaving}
            className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 custom-scrollbar">
          
          {/* Identity Section */}
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group shrink-0 mx-auto md:mx-0">
               <div className="w-36 h-36 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 relative overflow-hidden flex items-center justify-center group-hover:border-emerald-300 transition-all duration-500">
                  <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <Camera className="w-8 h-8" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Biometric Scan</span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4">Security ID Photo</p>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Identity Name</label>
                    {errors.name && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.name}</span>}
                  </div>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={cn(
                        "w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                        errors.name && "border-red-200 bg-red-50/30"
                      )}
                      placeholder="e.g. Robert Muzenda"
                    />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider Portal Email</label>
                    {errors.email && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.email}</span>}
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                        errors.email && "border-red-200 bg-red-50/30"
                      )}
                      placeholder="robert.m@zimcart.com"
                    />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Phone</label>
                    {errors.phone && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.phone}</span>}
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                        errors.phone && "border-red-200 bg-red-50/30"
                      )}
                      placeholder="+263 7XX XXX XXX"
                    />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal password</label>
                    {errors.password && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.password}</span>}
                  </div>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={cn(
                      "w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                      errors.password && "border-red-200 bg-red-50/30"
                    )}
                    placeholder="Min. 8 characters"
                  />
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm password</label>
                    {errors.confirmPassword && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.confirmPassword}</span>}
                  </div>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={cn(
                      "w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                      errors.confirmPassword && "border-red-200 bg-red-50/30"
                    )}
                    placeholder="Repeat password"
                  />
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gov ID / License No.</label>
                    {errors.idNumber && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.idNumber}</span>}
                  </div>
                  <div className="relative group">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                        errors.idNumber && "border-red-200 bg-red-50/30"
                      )}
                      placeholder="National ID or License"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-slate-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Classification</label>
                  <div className="relative">
                    <select 
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none shadow-sm"
                    >
                      <option value="Motorcycle">Heavy Motorbike</option>
                      <option value="Electric Scooter">Eco-Electric Scooter</option>
                      <option value="Van">Commercial Delivery Van</option>
                      <option value="Standard Bike">Utility Bicycle</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Bike className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License Plate / Tag</label>
                    {errors.licensePlate && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.licensePlate}</span>}
                  </div>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm uppercase",
                        errors.licensePlate && "border-red-200 bg-red-50/30"
                      )}
                      placeholder="ABC-123X"
                    />
                  </div>
                </div>
             </div>

             <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Operational Hub</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={formData.assignedHub}
                    onChange={(e) => setFormData({ ...formData, assignedHub: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none shadow-sm"
                  >
                    <option value="Harare Main Hub">Harare Main Hub (HQ)</option>
                    <option value="Bulawayo Central Hub">Bulawayo Central Hub</option>
                    <option value="Mutare Regional Hub">Mutare Regional Hub</option>
                    <option value="Gweru Hub">Gweru Specialized Hub</option>
                  </select>
                </div>
             </div>

             <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial fleet status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as (typeof formData)["status"] })
                  }
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none shadow-sm"
                >
                  <option value="Available">Available for dispatch</option>
                  <option value="Offline">Offline / starting later</option>
                  <option value="Dispatched">On delivery (testing)</option>
                  <option value="Banned">Suspended (blocked)</option>
                </select>
             </div>

             <div className="p-6 bg-blue-50/40 rounded-[24px] border border-blue-100/50 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-blue-100">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-1">Fleet Security Verification</h4>
                  <p className="text-[11px] font-medium text-blue-800/70 leading-relaxed italic">
                    All onboarded riders must complete a physical document verification at their assigned hub within 24 hours of account activation.
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-4">
           <button 
             onClick={resetAndClose}
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
                 <span>Onboarding...</span>
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-5 h-5" />
                 <span>Create Rider</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
