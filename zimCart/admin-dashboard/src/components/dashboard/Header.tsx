"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, MessageSquare, ChevronDown, Menu, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessagesDropdown } from "./header/MessagesDropdown";
import { NotificationsDropdown } from "./header/NotificationsDropdown";
import { ProfileDropdown } from "./header/ProfileDropdown";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [activeDropdown, setActiveDropdown] = useState<"notifs" | "msgs" | "profile" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleGlobalEvents(event: MouseEvent | KeyboardEvent) {
      if (event instanceof MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleGlobalEvents as any);
    document.addEventListener("keydown", handleGlobalEvents as any);
    
    return () => {
      document.removeEventListener("mousedown", handleGlobalEvents as any);
      document.removeEventListener("keydown", handleGlobalEvents as any);
    };
  }, []);

  const toggleDropdown = (type: "notifs" | "msgs" | "profile") => {
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const closeDropdown = () => setActiveDropdown(null);

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

      <div className="flex items-center gap-3 md:gap-5" ref={dropdownRef}>
        <div className="flex items-center gap-1.5 md:gap-3 border-r border-slate-100 pr-4 md:pr-6">
          
          {/* Messages */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("msgs")}
              className={cn(
                "p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative group outline-none",
                activeDropdown === "msgs" && "bg-emerald-50 text-emerald-600"
              )}
            >
              <MessageSquare className="w-5 h-5 group-active:scale-90 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-500/20" />
            </button>
            <MessagesDropdown isOpen={activeDropdown === "msgs"} onClose={closeDropdown} />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown("notifs")}
              className={cn(
                "p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative group outline-none",
                activeDropdown === "notifs" && "bg-emerald-50 text-emerald-600"
              )}
            >
              <Bell className="w-5 h-5 group-active:scale-90 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20" />
            </button>
            <NotificationsDropdown isOpen={activeDropdown === "notifs"} onClose={closeDropdown} />
          </div>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => toggleDropdown("profile")}
            className={cn(
              "flex items-center gap-3 p-1 hover:bg-slate-50 rounded-2xl transition-all group outline-none",
              activeDropdown === "profile" && "bg-slate-50"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 border-2 border-emerald-500/20 flex items-center justify-center text-white font-bold overflow-hidden shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-active:scale-95 transition-transform">
              <img 
                src="https://ui-avatars.com/api/?name=Zain+Ali&background=10B981&color=fff&bold=true" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-bold text-slate-800 leading-tight">Zain Ali</p>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">Tier 1 Admin</p>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all ml-1", activeDropdown === "profile" && "rotate-180")} />
          </button>
          <ProfileDropdown isOpen={activeDropdown === "profile"} onClose={closeDropdown} />
        </div>
      </div>
    </header>
  );
}
