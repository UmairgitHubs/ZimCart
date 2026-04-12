"use client";

import React, { useEffect, useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Save,
  AlertTriangle,
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MartStoreSettingsDto } from "@/types/martSettings";
import type { StoreSettings } from "@/types/settings";
import { buildMartSettingsPatch } from "@/lib/mart-settings-mapper";

interface StoreSettingsFormProps {
  initialData: StoreSettings;
  serverSnapshot: MartStoreSettingsDto | null;
  userRole: "ADMIN" | "STORE_MANAGER";
  adminStoreId?: string;
  onSave: (patch: Record<string, unknown>) => Promise<void>;
  isSaving: boolean;
  syncKey: string;
}

export function StoreSettingsForm({
  initialData,
  serverSnapshot,
  userRole,
  adminStoreId,
  onSave,
  isSaving,
  syncKey,
}: StoreSettingsFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData);
    setLocalError(null);
  }, [initialData, syncKey]);

  const handleSave = async () => {
    if (!serverSnapshot) {
      setLocalError("Mart data is not loaded yet.");
      return;
    }
    setLocalError(null);
    try {
      const patch = buildMartSettingsPatch(formData, serverSnapshot, {
        role: userRole,
        adminStoreId,
      });
      await onSave(patch);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="mb-2 flex items-center gap-2 text-emerald-600">
        <Store className="w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Mart profile & operations</h2>
      </div>

      {localError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {localError}
        </div>
      )}

      <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 space-y-5">
        <h3 className="text-[14px] font-semibold text-slate-800">Public mart details</h3>
        <p className="text-[13px] text-slate-500">
          These fields map to the database mart record (name, description, image, delivery, fees, status).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[13px] font-medium text-slate-700">Mart name</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[13px] font-medium text-slate-700">Description</label>
            <textarea
              value={formData.martDescription}
              onChange={(e) => setFormData({ ...formData, martDescription: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[13px] font-medium text-slate-700">Image URL</label>
            <input
              type="url"
              value={formData.martImageUrl}
              onChange={(e) => setFormData({ ...formData, martImageUrl: e.target.value })}
              placeholder="https://…"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Delivery time label</label>
            <input
              type="text"
              value={formData.martDeliveryTime}
              onChange={(e) => setFormData({ ...formData, martDeliveryTime: e.target.value })}
              placeholder='e.g. "30–45 min"'
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Min order (numeric)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={formData.martMinOrder}
              onChange={(e) =>
                setFormData({ ...formData, martMinOrder: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Delivery fee (numeric)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={formData.martDeliveryFee}
              onChange={(e) =>
                setFormData({ ...formData, martDeliveryFee: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Store status</label>
            <select
              value={formData.martStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  martStatus: e.target.value as StoreSettings["martStatus"],
                })
              }
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="BUSY">Busy</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
            <span className="text-[13px] font-medium text-slate-700">Mart active (discovery)</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, martIsActive: !formData.martIsActive })}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border",
                formData.martIsActive ? "bg-emerald-600 border-emerald-600" : "bg-slate-200 border-slate-300"
              )}
            >
              <span
                className={cn(
                  "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                  formData.martIsActive ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
        <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Contact & preferences</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          Stored in <code className="text-xs bg-white px-1 rounded">openingHours._preferences</code> JSON.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Contact email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Support phone
            </label>
            <input
              type="text"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" /> Physical address
            </label>
            <input
              type="text"
              value={formData.physicalAddress}
              onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="ZWL">ZWL</option>
              <option value="USD">USD</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Africa/Harare">Africa/Harare</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">VAT / tax rate (%)</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={formData.taxRate}
              onChange={(e) =>
                setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700">Delivery radius (km)</label>
            <input
              type="number"
              min={0}
              value={formData.deliveryRadiusKm}
              onChange={(e) =>
                setFormData({ ...formData, deliveryRadiusKm: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
        <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Hours & holidays</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          Default opening hours apply to every day (stored on <code className="text-xs bg-white px-1 rounded">openingHours</code> weekdays).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Opens</label>
              <input
                type="time"
                value={formData.storeHours?.openTime || "08:00"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storeHours: { ...formData.storeHours, openTime: e.target.value },
                  })
                }
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">Closes</label>
              <input
                type="time"
                value={formData.storeHours?.closeTime || "22:00"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storeHours: { ...formData.storeHours, closeTime: e.target.value },
                  })
                }
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div>
                <h4 className="text-[13px] font-semibold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Emergency flag
                </h4>
                <p className="text-[12px] text-rose-600 mt-0.5">Preference only — adjust status above to fully close.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, emergencyClose: !formData.emergencyClose })
                }
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border",
                  formData.emergencyClose ? "bg-rose-600 border-rose-600" : "bg-slate-200 border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                    formData.emergencyClose ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 flex items-center gap-1.5 mb-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Holidays
              </label>
              <div className="bg-white border border-slate-200 rounded-lg p-3 max-h-[140px] overflow-y-auto">
                {(formData.holidayCalendar ?? []).map((holiday, idx) => (
                  <div
                    key={`${holiday.date}-${idx}`}
                    className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
                  >
                    <span className="text-[12px] font-medium text-slate-700">{holiday.description}</span>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {holiday.date}
                    </span>
                  </div>
                ))}
                {(!formData.holidayCalendar || formData.holidayCalendar.length === 0) && (
                  <p className="text-[12px] text-slate-400">No holidays configured.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const desc = window.prompt("Holiday description?");
                  if (!desc) return;
                  const date = window.prompt("Date (YYYY-MM-DD)?");
                  if (!date) return;
                  setFormData({
                    ...formData,
                    holidayCalendar: [
                      ...(formData.holidayCalendar ?? []),
                      { date, description: desc },
                    ],
                  });
                }}
                className="text-[12px] font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md mt-2 transition-colors"
              >
                + Add holiday
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !serverSnapshot}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save mart settings
        </button>
      </div>
    </div>
  );
}
