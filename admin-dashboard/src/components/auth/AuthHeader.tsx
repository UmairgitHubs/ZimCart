"use client";

import React from "react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export default function AuthHeader({ title, subtitle, icon }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6 text-center">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
        <div className="text-slate-400">
          {icon || (
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          )}
        </div>
      </div>
      
      <p className="text-[13px] font-bold text-emerald-800 mb-1 uppercase tracking-widest">
        ZimCart
      </p>
      
      <h1 className="text-lg font-bold text-slate-800 tracking-tight">
        {title}
      </h1>
      <p className="text-[12px] font-medium text-slate-400 mt-0.5">
        {subtitle}
      </p>
    </div>
  );
}
