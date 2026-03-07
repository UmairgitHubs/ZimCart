"use client";

import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  inputClassName?: string;
}

export default function AuthInput({ label, icon, error, type, inputClassName, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1">
      <label className={`text-[12px] font-bold pl-0.5 tracking-tight ${error ? 'text-red-500' : 'text-slate-500'}`}>
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${error ? 'text-red-400' : 'text-slate-300 group-focus-within:text-emerald-700'} transition-colors gap-2`}>
            {icon}
          </div>
        )}
        <input
          {...props}
          type={inputType}
          className={`w-full h-11 ${icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} bg-white border rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 transition-all focus:outline-none ${error ? 'border-red-500 ring-red-500/10 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-slate-200 focus:border-emerald-700 focus:ring-emerald-700/10'} focus:ring-4 ${inputClassName || ''}`}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 pl-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
