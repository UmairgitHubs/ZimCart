"use client";

import React from "react";
import { Search, Bell, MessageSquare, ChevronDown, Menu } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 bg-white border-b border-slate-50 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl active:scale-95 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all relative">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-xl transition-all group">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-50 flex items-center justify-center text-emerald-700 font-bold overflow-hidden">
            <img 
              src="https://ui-avatars.com/api/?name=Zain+Ali&background=10B981&color=fff" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">Zain Ali</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Super Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all ml-1" />
        </button>
      </div>
    </header>
  );
}
