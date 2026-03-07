"use client";

import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function AuthButton({ children, isLoading, icon, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`relative w-full h-11 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 active:scale-[0.98] text-white rounded-xl font-bold text-[14px] transition-all shadow-[0_8px_20px_-6px_rgba(4,120,87,0.4)] hover:shadow-[0_12px_25px_-4px_rgba(4,120,87,0.5)] disabled:opacity-75 disabled:pointer-events-none group overflow-hidden ${props.className || ""}`}
    >
      <div className={`flex items-center justify-center gap-2 transition-all duration-300 ${isLoading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        {icon || (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        )}
        <span>{children}</span>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
}
