"use client";

import React from "react";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  Circle, 
  ExternalLink,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout.mutate();
    onClose();
  };

  const menuItems = [
    { icon: User, label: "My Profile", sub: "Account details", color: "text-blue-500" },
    { icon: Shield, label: "Security", sub: "2FA & sessions", color: "text-amber-500" },
    { icon: Settings, label: "Settings", sub: "Preferences", color: "text-slate-500" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-3 w-72 bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
        {/* Header Profile Info */}
        <div className="p-6 pb-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10B981&color=fff&bold=true&format=png`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                 </div>
              </div>
              <div>
                 <h4 className="text-sm font-black text-slate-800 tracking-tight truncate max-w-[150px]">{user.name}</h4>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    < Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role.replace('_', ' ')}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="px-3 py-2">
           <div className="space-y-1">
              {menuItems.map((item, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-slate-50 group transition-all active:scale-[0.98]"
                >
                   <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-white group-hover:shadow-sm", item.color)}>
                      <item.icon className="w-5 h-5" />
                   </div>
                   <div className="text-left flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-700 group-hover:text-slate-900 leading-none">{item.label}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{item.sub}</p>
                   </div>
                   <ExternalLink className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                </button>
              ))}
           </div>
        </div>

        <div className="p-3 bg-slate-50/50 mt-1">
           <button 
             onClick={handleLogout}
             disabled={logout.isPending}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all group active:scale-[0.98]"
           >
              <div className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all">
                 {logout.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              </div>
              <div className="text-left">
                 <p className="text-[12px] font-black uppercase tracking-widest leading-none">Terminate Session</p>
                 <p className="text-[10px] font-bold text-red-400/70 mt-1">Safely sign out</p>
              </div>
           </button>
        </div>
      </div>
    </>
  );
}

// Simple Loader component if not defined elsewhere
function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={cn("animate-spin", className)} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
