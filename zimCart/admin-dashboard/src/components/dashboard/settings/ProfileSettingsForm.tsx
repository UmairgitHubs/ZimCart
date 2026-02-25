import React, { useState } from "react";
import { User, Mail, Phone, Shield, Camera, Save } from "lucide-react";
import { ProfileSettings } from "@/types/settings";

interface ProfileSettingsFormProps {
  initialData: ProfileSettings;
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Profile Information</h2>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">Manage your personal admin account and authentication identity.</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[20px] text-[13px] font-black transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center gap-2 shrink-0">
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-12 bg-white/60 p-8 rounded-[32px] border border-white shadow-sm ring-1 ring-slate-100">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-5 xl:w-[240px] shrink-0">
          <div className="relative group overflow-hidden rounded-[40px] w-40 h-40 bg-slate-50 border-4 border-white shadow-xl shadow-slate-200/80 transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
            <img 
              src={formData.avatarUrl} 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer">
              <Camera className="w-8 h-8 text-white mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload</span>
            </div>
          </div>
          <div className="text-center">
             <h3 className="text-[14px] font-black text-slate-800">{formData.firstName} {formData.lastName}</h3>
             <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{formData.role}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex-1 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-emerald-500 transition-colors flex items-center gap-1.5">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full pl-11 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/40 transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-emerald-500 transition-colors flex items-center gap-1.5">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full pl-11 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-emerald-500 transition-colors flex items-center gap-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/40 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-emerald-500 transition-colors flex items-center gap-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full pl-11 bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/40 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 pt-4">
              <label className="text-[11px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Identity Role Assignment
              </label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full bg-emerald-50/50 border border-emerald-100/50 rounded-2xl px-5 py-3.5 text-[14px] font-black text-emerald-800 cursor-not-allowed shadow-inner shadow-emerald-100/20"
              />
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">Roles are managed via IAM policies and require super-admin overrrides.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
