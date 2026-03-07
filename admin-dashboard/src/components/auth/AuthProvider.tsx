"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authService } from "@/services/auth.service";
import { setCredentials, setLoading } from "@/lib/features/auth/authSlice";
import { AppDispatch } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initAuth = async () => {
      dispatch(setLoading(true));
      try {
        const response = await authService.getMe();
        if (response.data?.user) {
          dispatch(setCredentials({ user: response.data.user }));
        }
      } catch (error) {
        // Not authenticated or session expired - silent fail
        console.log("Session not found or expired");
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
