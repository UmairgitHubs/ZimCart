"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Save, User, Mail, Shield, Phone, Image as ImageIcon } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { setCredentials } from "@/lib/features/auth/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      phone: "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const handleSave = async () => {
    setLocalError(null);
    setLocalSuccess(null);
    try {
      const response = await updateProfile.mutateAsync({
        name: formData.name.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        avatar: formData.avatar.trim() || undefined,
      });
      const updatedUser = response?.data;
      if (updatedUser) {
        dispatch(
          setCredentials({
            user: {
              ...user,
              ...updatedUser,
            } as any,
          })
        );
      }
      setLocalSuccess("Profile updated successfully.");
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto space-y-6 animate-in fade-in duration-500 mt-4 pb-20 px-2 md:px-0">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Profile settings</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Update your account details used across the admin dashboard.
        </p>
      </div>

      {localError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {localError}
        </div>
      )}
      {localSuccess && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {localSuccess}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Full name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+263..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Avatar URL
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </p>
            <p className="text-sm font-bold text-slate-800 mt-1">{user.email}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Role
            </p>
            <p className="text-sm font-bold text-slate-800 mt-1">{user.role}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save profile
          </button>
        </div>
      </div>
    </div>
  );
}
