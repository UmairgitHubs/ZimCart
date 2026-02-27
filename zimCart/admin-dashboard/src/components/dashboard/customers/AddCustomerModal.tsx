"use client";

import React, { useState } from "react";
import { 
  X, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Camera, 
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Globe
} from "lucide-react";
import { Customer, CustomerStatus } from "@/types/customers";
import { cn } from "@/lib/utils";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newCustomer: Customer) => void;
}

export function AddCustomerModal({ isOpen, onClose, onConfirm }: AddCustomerModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active" as CustomerStatus,
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCustomer: Customer = {
      id: `CUST-${Math.floor(Math.random() * 9000) + 1000}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      location: formData.location,
      totalOrders: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString(),
      lastOrderDate: "Never",
      avatar: undefined
    };

    onConfirm(newCustomer);
    setIsSaving(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      location: "",
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Onboard Customer</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Initialize new account in ZimCart Registry</p>
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
          
          {/* Section: Profile Image */}
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group shrink-0 mx-auto md:mx-0">
               <div className="w-36 h-36 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 relative overflow-hidden flex items-center justify-center group-hover:border-emerald-300 transition-all duration-500">
                  <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <Camera className="w-8 h-8" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Upload Photo</span>
                  </div>
                  {/* Subtle Grainy Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4">Profile Avatar (Optional)</p>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    {errors.name && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.name}</span>}
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={cn(
                        "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                        errors.name && "border-red-200 bg-red-50/30"
                      )}
                      placeholder="e.g. Johnathan Doe"
                    />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Eligibility</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none shadow-sm"
                    >
                      <option value="Active">Verified Active</option>
                      <option value="Inactive">Holding / Passive</option>
                      <option value="Blocked">Restricted Access</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                  </div>
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Identity</label>
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
                      placeholder="john@zimcart.com"
                    />
                  </div>
               </div>

               <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Reach</label>
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
                      placeholder="+263 77 123 4567"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-slate-50">
             <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geographical Region</label>
                  {errors.location && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.location}</span>}
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={cn(
                      "w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none shadow-sm",
                      errors.location && "border-red-200 bg-red-50/30"
                    )}
                    placeholder="Harare, Zimbabwe"
                  />
                </div>
             </div>

             <div className="p-6 bg-emerald-50/40 rounded-[24px] border border-emerald-100/50 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-emerald-100">
                  <AlertCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-1">Registration Policy</h4>
                  <p className="text-[11px] font-medium text-emerald-800/70 leading-relaxed italic">
                    By submitting this record, you confirm that the customer has consented to ZimCart's privacy terms. A welcome invitation will be auto-dispatched to the registered email address.
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
                 <span>Create Customer</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
