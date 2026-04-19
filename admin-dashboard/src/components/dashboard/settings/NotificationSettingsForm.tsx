import React, { useEffect, useState } from "react";
import { Bell, Smartphone, Mail, AlertTriangle, Speaker, Save, Loader2 } from "lucide-react";
import { NotificationSettings } from "@/types/settings";
import { cn } from "@/lib/utils";

interface NotificationSettingsFormProps {
  initialData: NotificationSettings;
  onSave: (prefs: NotificationSettings) => Promise<void>;
  isSaving: boolean;
  syncKey: string;
}

export function NotificationSettingsForm({
  initialData,
  onSave,
  isSaving,
  syncKey,
}: NotificationSettingsFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData);
    setLocalError(null);
  }, [initialData, syncKey]);

  const toggleEmailAlert = (key: keyof NotificationSettings['emailAlerts']) => {
    setFormData(prev => ({
      ...prev,
      emailAlerts: {
        ...prev.emailAlerts,
        [key]: !prev.emailAlerts[key]
      }
    }));
  };

  const togglePushAlert = (key: keyof NotificationSettings['pushAlerts']) => {
    setFormData(prev => ({
      ...prev,
      pushAlerts: {
        ...prev.pushAlerts,
        [key]: !prev.pushAlerts[key]
      }
    }));
  };

  const handleSave = async () => {
    setLocalError(null);
    try {
      await onSave(formData);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to save notification settings");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="mb-6 flex items-center gap-2 text-emerald-600">
         <Bell className="w-5 h-5" />
         <h2 className="text-lg font-bold text-slate-800 tracking-tight">Telemetry & Alerts</h2>
      </div>
      {localError && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {localError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Email Alerts Block */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
          <div className="mb-5">
             <h3 className="text-[14px] font-semibold text-slate-800 mb-1 flex items-center gap-2">
               <Mail className="w-4 h-4 text-indigo-500" />
               Inbox Dispatch Rules
             </h3>
             <p className="text-[13px] text-slate-500">Configure email notifications for key events.</p>
          </div>

          <div className="space-y-3">
            <ToggleCard 
               title="New Order Received"
               description="Immediate dispatch to fulfillment center"
               isActive={formData.emailAlerts.newOrders}
               onToggle={() => toggleEmailAlert('newOrders')}
               icon={<Bell className="w-4 h-4" />}
            />
            <ToggleCard 
               title="Order Cancellations"
               description="Alerts for immediate refund processing"
               isActive={formData.emailAlerts.cancellations}
               onToggle={() => toggleEmailAlert('cancellations')}
               icon={<AlertTriangle className="w-4 h-4" />}
            />
            <ToggleCard 
               title="Low Inventory Warnings"
               description="System alerts when stock falls below par"
               isActive={formData.emailAlerts.inventoryLow}
               onToggle={() => toggleEmailAlert('inventoryLow')}
               icon={<Speaker className="w-4 h-4" />}
            />
            <ToggleCard 
               title="Marketing Digests"
               description="Daily conversion tracking and summary emails"
               isActive={formData.emailAlerts.marketing}
               onToggle={() => toggleEmailAlert('marketing')}
               icon={<Mail className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Push Alerts Block */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
          <div className="mb-5">
             <h3 className="text-[14px] font-semibold text-slate-800 mb-1 flex items-center gap-2">
               <Smartphone className="w-4 h-4 text-emerald-500" />
               Device Push Notifications
             </h3>
             <p className="text-[13px] text-slate-500">Configure mobile push alerts for fast response.</p>
          </div>

          <div className="space-y-3">
            <ToggleCard 
               title="New Order Received"
               description="Mobile push notification for new orders"
               isActive={formData.pushAlerts.newOrders}
               onToggle={() => togglePushAlert('newOrders')}
               icon={<Bell className="w-4 h-4" />}
               pulseColor="emerald"
            />
            <ToggleCard 
               title="Platform Cancellations"
               description="Immediate ping for abandoned baskets"
               isActive={formData.pushAlerts.cancellations}
               onToggle={() => togglePushAlert('cancellations')}
               icon={<AlertTriangle className="w-4 h-4" />}
               pulseColor="red"
            />
            <ToggleCard 
               title="Support Ticket Escalation"
               description="Customer support SLA breaches"
               isActive={formData.pushAlerts.supportTickets}
               onToggle={() => togglePushAlert('supportTickets')}
               icon={<AlertTriangle className="w-4 h-4" />}
               pulseColor="amber"
            />
            <ToggleCard 
               title="System & Fleet Updates"
               description="Rider GPS or Server maintenance notices"
               isActive={formData.pushAlerts.systemUpdates}
               onToggle={() => togglePushAlert('systemUpdates')}
               icon={<Smartphone className="w-4 h-4" />}
            />
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save notifications
        </button>
      </div>
    </div>
  );
}

// Custom specialized toggle component for this config page
interface ToggleCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  pulseColor?: 'emerald' | 'amber' | 'red';
}

function ToggleCard({ title, description, isActive, onToggle, icon, pulseColor = 'emerald' }: ToggleCardProps) {
  const iconBg = isActive 
    ? pulseColor === 'red' ? "bg-red-50 text-red-600 border-red-100"
      : pulseColor === 'amber' ? "bg-amber-50 text-amber-600 border-amber-100"
      : "bg-emerald-50 border-emerald-100 text-emerald-600"
    : "bg-slate-50 border-slate-200 text-slate-400";
    
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3.5 rounded-lg transition-all cursor-pointer group hover:bg-white bg-white/60 border",
        isActive ? "border-emerald-100 shadow-sm" : "border-slate-100"
      )}
      onClick={onToggle}
    >
       <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors border", iconBg)}>
            {icon}
          </div>
          <div>
            <h4 className={cn("text-[13px] font-semibold transition-colors", isActive ? "text-slate-800" : "text-slate-600")}>{title}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          </div>
       </div>

       {/* Native-style switch */}
       <div className={cn(
         "w-[34px] h-[20px] rounded-full p-0.5 transition-all duration-300 relative shrink-0",
         isActive 
           ? pulseColor === 'red' ? "bg-red-500" : pulseColor === 'amber' ? "bg-amber-500" : "bg-emerald-500" 
           : "bg-slate-200"
       )}>
         <div className={cn(
           "w-[16px] h-[16px] bg-white rounded-full shadow-sm transform transition-transform duration-300",
           isActive ? "translate-x-[14px]" : "translate-x-0"
         )} />
       </div>
    </div>
  );
}
