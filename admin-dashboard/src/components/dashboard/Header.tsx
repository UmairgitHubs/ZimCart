"use client";

import React from "react";
import { Search, Bell, MessageSquare, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";

/**
 * Senior Optimized Header
 * - Removed all dropdown state to simplify DOM and improve performance.
 * - Centralized user identity logic using Redux.
 * - Integrated direct Logout for a faster workflow.
 */
export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();

  console.log(user)

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out of the ZimCart Registry?")) {
      logout.mutate();
    }
  };

  return (
    <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl active:scale-95 transition-all outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Universal Search bar */}
        <div className="relative hidden md:block w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search resources, orders, or riders..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 border-r border-slate-100 pr-4 md:pr-6">
          {/* Quick-Action Icons (Stateless) */}
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative outline-none">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
          </button>

          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative outline-none">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* User Identity Section */}
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-600 border-2 border-emerald-500/20 overflow-hidden shadow-lg shadow-emerald-500/10">
               <img 
                 src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=10B981&color=fff&bold=true&format=png`} 
                 alt="Identity" 
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="text-left hidden sm:block">
               <p className="text-[13px] font-black text-slate-800 leading-tight truncate max-w-[120px]">{user?.name || "ZimCart Admin"}</p>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.15em] mt-0.5">{user?.role?.replace('_', ' ') || "Administrator"}</p>
             </div>
          </div>

          {/* Explicit Logout - Faster workflow than a dropdown */}
          <button 
            onClick={handleLogout}
            disabled={logout.isPending}
            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 group outline-none ml-2 border border-transparent hover:border-red-100"
            title="Secure Logout"
          >
            {logout.isPending ? (
               <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            ) : (
               <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
