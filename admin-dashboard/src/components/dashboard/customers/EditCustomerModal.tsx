"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Camera,
  AlertCircle,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { Customer, CustomerStatus } from "@/types/customers";
import { cn } from "@/lib/utils";
import { uploadService } from "@/services/upload.service";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedCustomer: Customer) => Promise<void>;
  customer: Customer | null;
}

export function EditCustomerModal({ isOpen, onClose, onConfirm, customer }: EditCustomerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer && isOpen) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        location: customer.location,
      });
      setPreviewUrl(customer.avatar || null);
      setSelectedFile(null);
      setErrors({});
    }
  }, [customer, isOpen]);

  if (!isOpen || !customer) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
        setErrors({ name: "Name is required" });
        return;
    }

    setIsSaving(true);
    try {
        let finalAvatar = customer.avatar;

        if (selectedFile) {
            setIsUploading(true);
            finalAvatar = await uploadService.uploadSingle(selectedFile);
            setIsUploading(false);
        }

        await onConfirm({ ...customer, ...formData, avatar: finalAvatar } as Customer);
        onClose();
    } catch (err) {
        console.error("Sync Protocol Failure:", err);
        setErrors({ submit: "Registry sync failed. Verify permissions or network." });
    } finally {
        setIsSaving(false);
        setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" 
        onClick={isSaving ? undefined : onClose} 
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 flex">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Edit Profile</h2>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Update Information for {customer.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* Top Section: Avatar Update */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group shrink-0">
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileChange}
               />
               <div 
                 onClick={() => !isSaving && fileInputRef.current?.click()}
                 className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden shadow-inner flex items-center justify-center cursor-pointer group-hover:border-emerald-300 transition-all"
               >
                  {previewUrl ? (
                    <Image src={previewUrl} alt={customer.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  {/* Overlay Upload */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Camera className="w-5 h-5 text-white" />
                     </div>
                  </div>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center mt-3">Click to update avatar</p>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    {errors.name && <span className="text-[9px] font-bold text-red-500 uppercase">{errors.name}</span>}
                  </div>
                  <input 
                    type="text" 
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSaving}
                    className={cn(
                        "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none disabled:opacity-50",
                        errors.name && "border-red-200 bg-red-50/30"
                    )}
                    placeholder="Enter customer name"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Visibility</label>
                  <select 
                    value={formData.status || "Active"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
                    disabled={isSaving}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none appearance-none disabled:opacity-50"
                  >
                    <option value="Active">Active Profile</option>
                    <option value="Inactive">Inactive / On Break</option>
                    <option value="Blocked">Blocked / Suspended</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email" 
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSaving}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none disabled:opacity-50"
                      placeholder="email@example.com"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="text" 
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isSaving}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none disabled:opacity-50"
                      placeholder="+263 XXX XXX XXX"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-50">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Dispatch Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={isSaving}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500 transition-all outline-none disabled:opacity-50"
                    placeholder="City, Country"
                  />
                </div>
             </div>

             {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-tight">{errors.submit}</p>
                </div>
             )}

             <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-[11px] font-medium text-amber-800/80 leading-relaxed italic">
                  Note: Updating sensitive profile data will trigger a re-verification check within the ZimCart Ledger. Changes may take up to 2 minutes to propagate across edges.
                </p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={onClose}
             disabled={isSaving}
             className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
           >
             Dismiss
           </button>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={cn(
               "px-8 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-500/10 uppercase tracking-widest",
               isSaving && "opacity-70 cursor-not-allowed scale-[0.98]"
             )}
           >
              {isSaving || isUploading ? (
               <>
                 <Loader2 className="w-4 h-4 animate-spin text-white" />
                 <span>{isUploading ? "Uploading..." : "Synchronizing..."}</span>
               </>
             ) : (
               <>
                 <CheckCircle2 className="w-4 h-4" />
                 <span>Update Profile</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
