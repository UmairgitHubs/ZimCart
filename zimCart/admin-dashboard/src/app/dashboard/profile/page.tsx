"use client";

import React, { useState } from "react";
import { 
  Store,
  Settings,
  History,
  LogOut,
  Camera,
  Mail,
  Phone,
  MapPin,
  Percent,
  DollarSign,
  Bell,
  Clock,
  AlertTriangle
} from "lucide-react";
import { MOCK_STORE_SETTINGS } from "@/constants/settings";
import { cn } from "@/lib/utils";

type ProfileTab = 'info' | 'operations' | 'preferences' | 'activity';

const TABS: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { id: 'info', label: 'Store Info', icon: <Store className="w-4 h-4" /> },
  { id: 'operations', label: 'Operations', icon: <Settings className="w-4 h-4" /> },
  { id: 'preferences', label: 'Preferences', icon: <Bell className="w-4 h-4" /> },
  { id: 'activity', label: 'Activity Log', icon: <History className="w-4 h-4" /> },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [formData, setFormData] = useState(MOCK_STORE_SETTINGS);
  const [preferences, setPreferences] = useState({ 
    email: true, 
    push: true, 
    weekly: false,
    emergency: false,
    alarms: true
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20 mt-4 px-2 sm:px-0">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Store Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your mart&apos;s public information and operations
          </p>
        </div>
        <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Banner Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 ml-[1px]">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full md:w-auto">
              {/* Avatar block */}
              <div className="relative shrink-0">
                 <div className="w-20 h-20 rounded-full bg-slate-800 flex flex-col items-center justify-center text-white text-[22px] font-medium shadow-sm border border-slate-100">
                    {formData.storeName.substring(0, 2).toUpperCase()}
                 </div>
                 <button className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-emerald-700 transition-colors shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                 </button>
              </div>
              
              <div className="text-center sm:text-left pt-1">
                 <h2 className="text-[14px] font-medium text-slate-800">{formData.storeName}</h2>
                 <p className="text-[13px] text-slate-500 mt-0.5">Verified Mart Partner</p>
                 <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-3 text-[13px] text-slate-500">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {formData.contactEmail}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {formData.supportPhone}</span>
                 </div>
              </div>
           </div>

           <div className="text-center md:text-right w-full md:w-auto mt-4 md:mt-0 md:pt-1 shrink-0">
              <p className="text-[11px] font-medium text-slate-500">Member Since</p>
              <p className="text-[13px] font-medium text-slate-800 mt-1">January 2024</p>
           </div>
        </div>
      </div>

      {/* Tabbed Card Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[500px]">
        
        {/* Tab Headers */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100">
           <div className="flex min-w-max px-2">
             {TABS.map((tab) => {
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                     "relative flex items-center gap-2 px-6 py-4 text-[13px] font-medium transition-all duration-200",
                     isActive 
                       ? "text-emerald-600" 
                       : "text-slate-500 hover:text-slate-800"
                   )}
                 >
                   <span className={cn(
                      isActive ? "text-emerald-600" : "text-slate-400"
                   )}>
                     {tab.icon}
                   </span>
                   {tab.label}
                   {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600" />
                   )}
                 </button>
               );
             })}
           </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 flex-1 bg-white">
           
           {activeTab === 'info' && (
             <div className="animate-in fade-in duration-300">
                <div className="mb-6">
                   <h3 className="text-[14px] font-medium text-slate-800 flex items-center gap-2">
                     <Store className="w-4 h-4 text-emerald-600" /> Store Information
                   </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 max-w-4xl">
                   
                   <div className="space-y-1.5 border border-slate-200 bg-slate-50/40 rounded-lg p-4">
                     <label className="text-[12px] font-medium text-slate-600">Store Name</label>
                     <input
                       type="text"
                       value={formData.storeName}
                       onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                       className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                     />
                   </div>

                   <div className="space-y-1.5 border border-slate-200 bg-slate-50/40 rounded-lg p-4">
                     <label className="text-[12px] font-medium text-slate-600">Support Email</label>
                     <div className="relative">
                       <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input
                         type="email"
                         value={formData.contactEmail}
                         onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                         className="w-full pl-10 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                       />
                     </div>
                   </div>

                   <div className="space-y-1.5 border border-slate-200 bg-slate-50/40 rounded-lg p-4">
                     <label className="text-[12px] font-medium text-slate-600">Support Hotline</label>
                     <div className="relative">
                       <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input
                         type="tel"
                         value={formData.supportPhone}
                         onChange={(e) => setFormData({...formData, supportPhone: e.target.value})}
                         className="w-full pl-10 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                       />
                     </div>
                   </div>

                   <div className="space-y-1.5 border border-slate-200 bg-slate-50/40 rounded-lg p-4">
                     <label className="text-[12px] font-medium text-slate-600">Physical Location</label>
                     <div className="relative">
                       <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input
                         type="text"
                         value={formData.physicalAddress}
                         onChange={(e) => setFormData({...formData, physicalAddress: e.target.value})}
                         className="w-full pl-10 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                       />
                     </div>
                   </div>

                   <div className="space-y-1.5 border border-slate-200 bg-slate-50/40 rounded-lg p-4">
                     <label className="text-[12px] font-medium text-slate-600">Store Status</label>
                     <input
                       type="text"
                       value="Active & Verified Partner"
                       disabled
                       className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-500 cursor-not-allowed"
                     />
                   </div>

                   <div className="space-y-1.5 border border-slate-200 bg-slate-50/40 rounded-lg p-4">
                     <label className="text-[12px] font-medium text-slate-600">Registration Group</label>
                     <input
                       type="text"
                       value="ZimCart Wholesale Division"
                       disabled
                       className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-500 cursor-not-allowed"
                     />
                   </div>

                </div>

                <div className="mt-8 flex justify-end">
                  <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm flex items-center gap-2">
                     <Settings className="w-4 h-4" /> Save Changes
                  </button>
                </div>
             </div>
           )}

           {activeTab === 'operations' && (
             <div className="animate-in fade-in duration-300">
                <div className="mb-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                   <div>
                     <h3 className="text-[14px] font-medium text-slate-800 flex items-center gap-2">
                       <Settings className="w-4 h-4 text-emerald-600" /> Operational Directives
                     </h3>
                     <p className="text-[13px] text-slate-500 mt-1">Manage fulfillment rules, active hours, and emergency states.</p>
                   </div>
                   
                   {/* Emergency Switch */}
                   <div className="flex items-center gap-3 px-4 py-2.5 bg-rose-50 rounded-xl border border-rose-100 shadow-sm shrink-0">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span className="text-[13px] font-bold text-rose-700">Emergency Close Mode</span>
                      </div>
                      <button 
                         onClick={() => togglePreference('emergency')}
                         className={cn(
                           "relative w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border ml-2",
                           preferences.emergency ? "bg-rose-500 border-rose-500" : "bg-slate-200 border-slate-300"
                         )}
                       >
                         <div className={cn(
                           "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                           preferences.emergency ? "translate-x-5" : "translate-x-0"
                         )} />
                       </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
                   
                   <div className="space-y-4 border border-slate-200 bg-slate-50/50 rounded-xl p-5">
                     <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200/60 pb-2">Geofence & Fulfillment</h4>
                     
                     <div className="space-y-1.5">
                       <label className="text-[12px] font-medium text-slate-600">Delivery Radius (KM)</label>
                       <div className="relative">
                         <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input
                           type="number"
                           value={formData.deliveryRadiusKm}
                           onChange={(e) => setFormData({...formData, deliveryRadiusKm: parseFloat(e.target.value)})}
                           className="w-full pl-10 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                         />
                       </div>
                       <p className="text-[11px] text-slate-500 mt-1">Maximum distance for assigning orders to fleet riders.</p>
                     </div>

                     <div className="space-y-1.5 pt-2">
                       <label className="text-[12px] font-medium text-slate-600">Standard Prep Time (Mins)</label>
                       <div className="relative">
                         <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input
                           type="number"
                           defaultValue={15}
                           className="w-full pl-10 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                         />
                       </div>
                     </div>
                   </div>

                   <div className="space-y-4 border border-slate-200 bg-slate-50/50 rounded-xl p-5">
                     <h4 className="text-[13px] font-bold text-slate-800 border-b border-slate-200/60 pb-2">Picking & Substitution</h4>

                     <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg">
                        <div>
                           <p className="text-[12px] font-medium text-slate-700">Continuous Audio Alarms</p>
                           <p className="text-[11px] text-slate-500">For new unassigned orders</p>
                        </div>
                        <button 
                         onClick={() => togglePreference('alarms')}
                         className={cn(
                           "relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center px-1 border shrink-0",
                           preferences.alarms ? "bg-emerald-600 border-emerald-600" : "bg-slate-200 border-slate-300"
                         )}
                       >
                         <div className={cn(
                           "bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-300",
                           preferences.alarms ? "translate-x-4" : "translate-x-0"
                         )} />
                       </button>
                     </div>

                     <div className="space-y-1.5 pt-2">
                       <label className="text-[12px] font-medium text-slate-600">Weight Variance Policy</label>
                       <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                          <option>Mandatory Re-approval &gt; 15%</option>
                          <option>Mandatory Re-approval &gt; 10%</option>
                          <option>Always Require Customer Approval</option>
                       </select>
                       <p className="text-[11px] text-slate-500 mt-1">Tolerance delta for meat, produce & loose items.</p>
                     </div>

                   </div>

                </div>
                
                <div className="mt-8 flex justify-end">
                  <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm flex items-center gap-2">
                     <Settings className="w-4 h-4" /> Save Operations
                  </button>
                </div>
             </div>
           )}

           {activeTab === 'preferences' && (
              <div className="animate-in fade-in duration-300 max-w-4xl">
                 <div className="mb-6">
                    <h3 className="text-[14px] font-medium text-slate-800 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" /> Notification Preferences
                    </h3>
                 </div>

                 <div className="space-y-4">
                    {/* Email Toggle */}
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors">
                       <div>
                          <h4 className="text-[14px] font-medium text-slate-800">Email Notifications</h4>
                          <p className="text-[13px] text-slate-500 mt-0.5">Receive notifications via email</p>
                       </div>
                       <button 
                         onClick={() => togglePreference('email')}
                         className={cn(
                           "relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border",
                           preferences.email ? "bg-emerald-600 border-emerald-600" : "bg-slate-200 border-slate-300"
                         )}
                       >
                         <div className={cn(
                           "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                           preferences.email ? "translate-x-6" : "translate-x-0"
                         )} />
                       </button>
                    </div>

                    {/* Push Toggle */}
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors">
                       <div>
                          <h4 className="text-[14px] font-medium text-slate-800">Push Notifications</h4>
                          <p className="text-[13px] text-slate-500 mt-0.5">Receive browser push notifications</p>
                       </div>
                       <button 
                         onClick={() => togglePreference('push')}
                         className={cn(
                           "relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border",
                           preferences.push ? "bg-emerald-600 border-emerald-600" : "bg-slate-200 border-slate-300"
                         )}
                       >
                         <div className={cn(
                           "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                           preferences.push ? "translate-x-6" : "translate-x-0"
                         )} />
                       </button>
                    </div>

                    {/* Weekly Reports Toggle */}
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors">
                       <div>
                          <h4 className="text-[14px] font-medium text-slate-800">Weekly Reports</h4>
                          <p className="text-[13px] text-slate-500 mt-0.5">Receive weekly performance reports</p>
                       </div>
                       <button 
                         onClick={() => togglePreference('weekly')}
                         className={cn(
                           "relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border",
                           preferences.weekly ? "bg-emerald-600 border-emerald-600" : "bg-slate-200 border-slate-300"
                         )}
                       >
                         <div className={cn(
                           "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                           preferences.weekly ? "translate-x-6" : "translate-x-0"
                         )} />
                       </button>
                    </div>
                 </div>
                 
                 <div className="mt-8 flex justify-end">
                   <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Save Preferences
                   </button>
                 </div>
              </div>
           )}

           {activeTab === 'activity' && (
              <div className="animate-in fade-in duration-300">
                 <div className="relative border-l border-slate-200 ml-3 space-y-8 mt-2 pb-6">
                    <div className="relative pl-6">
                       <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-600" />
                       <p className="text-[13px] font-medium text-slate-800">Updated Store Operating Parameters</p>
                       <p className="text-[12px] text-slate-500 mt-1">Today at 10:42 AM • Admin System User</p>
                    </div>
                    <div className="relative pl-6">
                       <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
                       <p className="text-[13px] font-medium text-slate-800">Resolved Customer Dispute #8410</p>
                       <p className="text-[12px] text-slate-500 mt-1">Yesterday at 4:15 PM • Jane Doe</p>
                    </div>
                    <div className="relative pl-6">
                       <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300" />
                       <p className="text-[13px] font-medium text-slate-800">Uploaded new Mart Cover Image</p>
                       <p className="text-[12px] text-slate-500 mt-1">October 12th at 9:02 AM • Admin System User</p>
                    </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
