"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { setCredentials, setLoading } from "@/lib/features/auth/authSlice";
import { AppDispatch } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicAuthRoute =
      pathname === "/" ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/verify-reset-code");

    if (isPublicAuthRoute) {
      dispatch(setLoading(false));
      return;
    }

    const initAuth = async () => {
      dispatch(setLoading(true));
      try {
        const response = await authService.getMe();
        if (response.data?.user) {
          dispatch(setCredentials({ user: response.data.user }));
        }
      } catch {
        // Not authenticated or session expired - silent fail
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch, pathname]);

  return <>{children}</>;
}
