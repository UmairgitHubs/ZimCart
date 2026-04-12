"use client";

import React, { useMemo, useState } from "react";
import { Store, Bell, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { MOCK_NOTIFICATION_SETTINGS, MOCK_SECURITY_SETTINGS } from "@/constants/settings";
import { StoreSettingsForm } from "@/components/dashboard/settings/StoreSettingsForm";
import { NotificationSettingsForm } from "@/components/dashboard/settings/NotificationSettingsForm";
import { SecuritySettingsForm } from "@/components/dashboard/settings/SecuritySettingsForm";
import { RootState } from "@/lib/store";
import { useMartSettings } from "@/hooks/useMartSettings";
import { martDtoToStoreSettings } from "@/lib/mart-settings-mapper";
import apiClient from "@/lib/api-client";

type SettingTab = "store" | "notifications" | "security" | "team";

interface TabList {
  id: SettingTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabList[] = [
  { id: "store", label: "Store preferences", icon: <Store className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "security", label: "Access & security", icon: <ShieldCheck className="w-4 h-4" /> },
];

type MartListItem = { id: string; name: string; status?: string; isActive?: boolean };

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("store");
  const [adminStoreId, setAdminStoreId] = useState<string | null>(null);

  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const { data: marts, isLoading: martsLoading } = useQuery({
    queryKey: ["admin-marts-directory"],
    queryFn: async () => {
      const res = await apiClient.get("/marts/admin/directory");
      return res.data.data as MartListItem[];
    },
    enabled: isAdmin,
  });

  const settingsEnabled = !isAdmin || !!adminStoreId;

  const { store, isLoading, error, save, isSaving } = useMartSettings({
    adminStoreId: isAdmin ? adminStoreId ?? undefined : undefined,
    enabled: settingsEnabled,
  });

  const formSeed = useMemo(() => (store ? martDtoToStoreSettings(store) : null), [store]);
  const syncKey = store ? `${store.id}-${store.updatedAt}` : "";

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20 mt-4 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System settings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Mart profile is saved to <code className="text-xs bg-slate-100 px-1 rounded">PATCH /marts/admin/settings</code>
            . Notifications and security below are still local placeholders.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b border-slate-100 px-2 sm:px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDisabled = tab.id === "team";
              return (
                <button
                  key={tab.id}
                  type="button"
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
                  <span
                    className={cn(
                      "flex items-center justify-center transition-colors",
                      isActive ? "text-emerald-600" : "text-slate-400"
                    )}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                  {isActive && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === "store" && (
            <div className="space-y-6">
              {isAdmin && (
                <div className="space-y-2 max-w-lg">
                  <label className="text-[13px] font-medium text-slate-700">Mart to configure</label>
                  <select
                    value={adminStoreId ?? ""}
                    onChange={(e) => setAdminStoreId(e.target.value || null)}
                    disabled={martsLoading}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">Select a mart…</option>
                    {(marts ?? []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                        {m.status && m.status !== "OPEN" ? ` — ${m.status}` : ""}
                        {m.isActive === false ? " (inactive)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-[12px] text-slate-500">
                    Admins must pick a mart. Store managers edit their linked mart automatically.
                  </p>
                </div>
              )}

              {!settingsEnabled && isAdmin && (
                <p className="text-sm text-slate-500">Choose a mart to load settings.</p>
              )}

              {settingsEnabled && isLoading && (
                <div className="flex items-center gap-3 text-slate-500 py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <span className="text-sm font-semibold">Loading mart settings…</span>
                </div>
              )}

              {settingsEnabled && error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{(error as Error).message}</span>
                </div>
              )}

              {settingsEnabled && !isLoading && formSeed && store && (
                <StoreSettingsForm
                  key={syncKey}
                  initialData={formSeed}
                  serverSnapshot={store}
                  userRole={isAdmin ? "ADMIN" : "STORE_MANAGER"}
                  adminStoreId={adminStoreId ?? undefined}
                  onSave={(patch) => save(patch)}
                  isSaving={isSaving}
                  syncKey={syncKey}
                />
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <NotificationSettingsForm initialData={MOCK_NOTIFICATION_SETTINGS} />
          )}
          {activeTab === "security" && <SecuritySettingsForm initialData={MOCK_SECURITY_SETTINGS} />}
        </div>
      </div>
    </div>
  );
}
