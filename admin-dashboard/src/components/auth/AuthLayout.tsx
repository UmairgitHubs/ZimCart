"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-emerald-800 via-green-900 to-teal-950">
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-500 overflow-hidden p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
