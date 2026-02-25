"use client";

import React, { useState } from "react";
import { 
  User, 
  Store, 
  Bell, 
  ShieldCheck,
  Building2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  MOCK_STORE_SETTINGS,
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_SECURITY_SETTINGS
} from "@/constants/settings";
import { StoreSettingsForm } from "@/components/dashboard/settings/StoreSettingsForm";
import { NotificationSettingsForm } from "@/components/dashboard/settings/NotificationSettingsForm";
import { SecuritySettingsForm } from "@/components/dashboard/settings/SecuritySettingsForm";

type SettingTab = 'store' | 'notifications' | 'security' | 'team';

interface TabList {
  id: SettingTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabList[] = [
  { id: 'store', label: 'Store Preferences', icon: <Store className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'security', label: 'Access & Security', icon: <ShieldCheck className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>('store');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20 mt-4 px-2 md:px-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Settings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Configure system-wide settings and preferences.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm self-start md:self-auto flex items-center justify-center">
            Save All Changes
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Horizontal Navigation */}
        <div className="border-b border-slate-100 px-2 sm:px-4 overflow-x-auto no-scrollbar">
           <div className="flex items-center min-w-max">
             {TABS.map((tab) => {
               const isActive = activeTab === tab.id;
               const isDisabled = tab.id === 'team';
               return (
                 <button
                   key={tab.id}
                   onClick={() => !isDisabled && setActiveTab(tab.id)}
                   disabled={isDisabled}
                   className={cn(
                     "relative flex items-center gap-2 px-5 py-4 text-[13px] font-semibold tracking-wide transition-all duration-200",
                     isActive 
                       ? "text-emerald-600" 
                       : isDisabled
                         ? "text-slate-300 cursor-not-allowed"
                         : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                   )}
                 >
                   <span className={cn(
                      "flex items-center justify-center transition-colors",
                      isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-500"
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

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
           {activeTab === 'store' && <StoreSettingsForm initialData={MOCK_STORE_SETTINGS} />}
           {activeTab === 'notifications' && <NotificationSettingsForm initialData={MOCK_NOTIFICATION_SETTINGS} />}
           {activeTab === 'security' && <SecuritySettingsForm initialData={MOCK_SECURITY_SETTINGS} />}
        </div>
      </div>

    </div>
  );
}
