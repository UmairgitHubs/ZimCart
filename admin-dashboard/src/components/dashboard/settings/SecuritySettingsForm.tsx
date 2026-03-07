import React, { useState } from "react";
import { KeyRound, Shield, Smartphone, Monitor, Clock, CheckCircle2, Save, LogOut } from "lucide-react";
import { SecuritySettings } from "@/types/settings";
import { cn } from "@/lib/utils";

interface SecuritySettingsFormProps {
  initialData: SecuritySettings;
}

export function SecuritySettingsForm({ initialData }: SecuritySettingsFormProps) {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="mb-6 flex items-center gap-2 text-emerald-600">
         <Shield className="w-5 h-5" />
         <h2 className="text-lg font-bold text-slate-800 tracking-tight">Security & Authentication</h2>
      </div>

      <div className="space-y-4">

        {/* 2FA Toggle Block */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div>
              <h3 className="text-[14px] font-semibold text-slate-800 mb-1">
                 Two-Factor Authentication
              </h3>
              <p className="text-[13px] text-slate-500">Require 2FA for all admin accounts.</p>
           </div>
           
           <button 
             onClick={() => setFormData({ ...formData, twoFactorAuth: !formData.twoFactorAuth })}
             className={cn(
               "px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto",
               formData.twoFactorAuth ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" : "bg-emerald-600 hover:bg-emerald-700 text-white"
             )}
           >
             {formData.twoFactorAuth ? 'Disable 2FA' : 'Configure 2FA'}
           </button>
        </div>

        {/* Session Tracking Block (Re-styled as Timeout) */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 flex flex-col gap-4">
           <div>
              <h3 className="text-[14px] font-semibold text-slate-800 mb-1">
                 Session Timeout
              </h3>
              <p className="text-[13px] text-slate-500">Automatically log out inactive users.</p>
           </div>
           
           <div className="w-full max-w-xs">
              <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none">
                 <option>15 Minutes</option>
                 <option>30 Minutes</option>
                 <option>1 Hour</option>
                 <option>4 Hours</option>
              </select>
           </div>
        </div>

        {/* Password Reset Component */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
           <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Password Policy</h3>
           <p className="text-[13px] text-slate-500 mb-4">Minimum password requirements:</p>
           
           <ul className="space-y-2 mb-6 ml-1">
              <li className="flex items-center gap-2 text-[13px] text-slate-600">
                <div className="w-1 h-1 rounded-full bg-slate-400" /> Minimum 8 characters
              </li>
              <li className="flex items-center gap-2 text-[13px] text-slate-600">
                <div className="w-1 h-1 rounded-full bg-slate-400" /> Require uppercase letters
              </li>
              <li className="flex items-center gap-2 text-[13px] text-slate-600">
                <div className="w-1 h-1 rounded-full bg-slate-400" /> Require numbers
              </li>
              <li className="flex items-center gap-2 text-[13px] text-slate-600">
                <div className="w-1 h-1 rounded-full bg-slate-400" /> Require special characters
              </li>
           </ul>

           <div className="space-y-3 w-full max-w-sm">
             <input
               type="password"
               placeholder="Current Password"
               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
             />
             <input
               type="password"
               placeholder="New Password"
               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
             />
             <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm mt-1">
                Update Password
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
