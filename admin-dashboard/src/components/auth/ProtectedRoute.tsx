"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/");
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router]);

  // Handle Unauthorized Role Access
  const isUnauthorized = isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center bg-slate-50"
        suppressHydrationWarning
      >
        <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
          <div
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"
            suppressHydrationWarning
          />
          <p className="text-slate-500 font-bold animate-pulse text-sm" suppressHydrationWarning>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // Let useEffect handle redirect

  if (isUnauthorized) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center bg-slate-50 p-6 text-center"
        suppressHydrationWarning
      >
        <div
          className="max-w-md bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200 border border-slate-100 flex flex-col items-center gap-6"
          suppressHydrationWarning
        >
          <div
            className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500"
            suppressHydrationWarning
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Access Restricted</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Your account ({user?.role}) does not have permission to access the Mart Portal. Please log in with a Mart Partner account.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'} // Hard refresh to login page
            className="w-full h-12 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all active:scale-[0.98]"
          >
            Switch Account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
