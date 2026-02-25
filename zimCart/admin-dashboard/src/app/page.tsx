"use client";

import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    login.mutate(data);
  };

  return (
    <AuthLayout>
      <AuthHeader 
        title="ZimCart Mart Portal" 
        subtitle="Partner Dashboard Login" 
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600 animate-in shake-1">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="mart@zimcart.com"
          error={errors.email?.message}
          {...register("email")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        <div className="flex items-center justify-between px-1 text-[13px] font-medium">
          <label className="flex items-center cursor-pointer group text-slate-500 hover:text-slate-700">
            <input 
              type="checkbox" 
              {...register("rememberMe")}
              className="w-[18px] h-[18px] border-2 border-slate-200 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer" 
            />
            <span className="ml-2.5">Remember me</span>
          </label>
          <Link href="/forgot-password" title="Recover Password" className="text-emerald-600 hover:text-emerald-700 font-bold transition-all">
            Forgot Password?
          </Link>
        </div>

        <AuthButton 
          type="submit" 
          isLoading={login.isPending}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          }
        >
          Sign In
        </AuthButton>
      </form>

      <div className="mt-8 text-center text-[13px] font-medium text-slate-500">
        Don't have a partner account?{" "}
        <Link href="/signup" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
          Register Mart
        </Link>
      </div>

    </AuthLayout>
  );
}
