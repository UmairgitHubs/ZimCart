import React, { useEffect, useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { SecuritySettings } from "@/types/settings";
import { cn } from "@/lib/utils";

interface SecuritySettingsFormProps {
  initialData: SecuritySettings;
  onSave: (sessionTimeoutMinutes: SecuritySettings["sessionTimeoutMinutes"]) => Promise<void>;
  onToggleTwoFactor: (isEnabled: boolean) => Promise<void>;
  onRevokeSession: (sessionId: string) => Promise<void>;
  onRevokeOtherSessions: () => Promise<void>;
  onChangePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  isSaving: boolean;
  isUpdatingTwoFactor: boolean;
  isChangingPassword: boolean;
  isRevokingSession: boolean;
  isRevokingOthers: boolean;
  syncKey: string;
}

export function SecuritySettingsForm({
  initialData,
  onSave,
  onToggleTwoFactor,
  onRevokeSession,
  onRevokeOtherSessions,
  onChangePassword,
  isSaving,
  isUpdatingTwoFactor,
  isChangingPassword,
  isRevokingSession,
  isRevokingOthers,
  syncKey,
}: SecuritySettingsFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setFormData(initialData);
    setLocalError(null);
    setPasswordError(null);
    setPasswordSuccess(null);
  }, [initialData, syncKey]);

  const handleSave = async () => {
    setLocalError(null);
    try {
      await onSave(formData.sessionTimeoutMinutes);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to save security settings");
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await onChangePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password updated successfully.");
    } catch (e) {
      setPasswordError(e instanceof Error ? e.message : "Failed to update password.");
    }
  };

  const handleTwoFactorToggle = async () => {
    setLocalError(null);
    const next = !formData.twoFactorAuth;
    try {
      await onToggleTwoFactor(next);
      setFormData({ ...formData, twoFactorAuth: next });
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to update two-factor settings");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="mb-6 flex items-center gap-2 text-emerald-600">
         <Shield className="w-5 h-5" />
         <h2 className="text-lg font-bold text-slate-800 tracking-tight">Security & Authentication</h2>
      </div>
      {localError && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {localError}
        </div>
      )}

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
             onClick={handleTwoFactorToggle}
             disabled={isUpdatingTwoFactor}
             className={cn(
               "px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm self-start sm:self-auto disabled:opacity-60 inline-flex items-center gap-2",
               formData.twoFactorAuth ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" : "bg-emerald-600 hover:bg-emerald-700 text-white"
             )}
           >
             {isUpdatingTwoFactor ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
              <select
                value={formData.sessionTimeoutMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sessionTimeoutMinutes: Number(e.target.value) as SecuritySettings["sessionTimeoutMinutes"],
                  })
                }
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
              >
                 <option value={15}>15 Minutes</option>
                 <option value={30}>30 Minutes</option>
                 <option value={60}>1 Hour</option>
                 <option value={240}>4 Hours</option>
              </select>
           </div>
        </div>

        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Active Sessions</h3>
              <p className="text-[13px] text-slate-500">Review devices currently signed in to this account.</p>
            </div>
            <button
              type="button"
              onClick={onRevokeOtherSessions}
              disabled={isRevokingOthers || isRevokingSession}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {isRevokingOthers ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Revoke Other Sessions
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {formData.activeSessions.length === 0 ? (
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                No active sessions found.
              </p>
            ) : (
              formData.activeSessions.map((session) => {
                const sessionId = session.id;
                const canRevoke = !session.isCurrent && !!sessionId;
                return (
                  <div
                    key={session.id ?? `${session.device}-${session.lastActive}`}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {session.device} {session.isCurrent ? <span className="text-emerald-600">(Current)</span> : null}
                      </p>
                      <p className="text-xs text-slate-500">{session.location}</p>
                      <p className="text-xs text-slate-500">Last active: {session.lastActive}</p>
                    </div>
                    {canRevoke ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (sessionId) {
                            void onRevokeSession(sessionId);
                          }
                        }}
                        disabled={isRevokingSession || isRevokingOthers}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60"
                      >
                        {isRevokingSession ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        Revoke
                      </button>
                    ) : null}
                  </div>
                );
              })
            )}
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
             {passwordError && (
               <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                 {passwordError}
               </div>
             )}
             {passwordSuccess && (
               <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                 {passwordSuccess}
               </div>
             )}
             <input
               type="password"
               placeholder="Current Password"
               value={currentPassword}
               onChange={(e) => setCurrentPassword(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
             />
             <input
               type="password"
               placeholder="New Password"
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
             />
             <input
               type="password"
               placeholder="Confirm New Password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
             />
             <button
               type="button"
               onClick={handlePasswordUpdate}
               disabled={isChangingPassword}
               className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors shadow-sm mt-1 inline-flex items-center gap-2"
             >
                {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Update Password
             </button>
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
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save security settings
        </button>
      </div>
    </div>
  );
}
