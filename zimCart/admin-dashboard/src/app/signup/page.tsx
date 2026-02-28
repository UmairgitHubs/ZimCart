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
import { useRouter } from "next/navigation";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { RootState } from "@/lib/store";
import { Globe, Lock, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
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
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      martName: "",
      email: "",
      phone: "",
      country: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      agreeToPrivacy: false,
    }
  });

  const onSubmit: SubmitHandler<SignupInput> = (data) => {
    // Map martName to name for the backend and enforce STORE_MANAGER role
    signup.mutate({ 
      ...data, 
      name: data.martName, 
      role: 'STORE_MANAGER' 
    });
  };

  return (
    <AuthLayout>
      <AuthHeader 
        title="Register Mart" 
        subtitle="Join the ZimCart Partner Network"
      />

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-lg text-[11px] font-bold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label="Mart Name"
          placeholder="e.g. Fresh Mart Central"
          error={errors.martName?.message}
          {...register("martName")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />

        <AuthInput
          label="Business Email"
          type="email"
          placeholder="partner@example.com"
          error={errors.email?.message}
          {...register("email")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthInput
            label="Contact Number"
            type="tel"
            placeholder="e.g. 0325 5525300"
            error={errors.phone?.message}
            {...register("phone")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <div className="space-y-1">
            <label className={`text-[12px] font-bold pl-0.5 tracking-tight ${errors.country ? 'text-red-500' : 'text-slate-500'}`}>
              Country
            </label>
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${errors.country ? 'text-red-400' : 'text-slate-300 group-focus-within:text-emerald-700'} transition-colors gap-2`}>
                <Globe className="w-5 h-5" />
              </div>
              <select
                {...register("country")}
                className={`w-full h-11 pl-10 pr-4 bg-white border rounded-xl text-[13px] text-slate-700 appearance-none focus:outline-none ${errors.country ? 'border-red-500 ring-red-500/10 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-slate-200 focus:border-emerald-700 focus:ring-emerald-700/10'} focus:ring-4 transition-all`}
              >
                <option value="">Select Country</option>
                <option value="PK">Pakistan</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="AE">United Arab Emirates</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.country && (
              <p className="text-[10px] font-bold text-red-500 pl-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
            icon={<Lock className="w-5 h-5" />}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            icon={<ShieldCheck className="w-5 h-5" />}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 group">
            <div className="relative flex items-center h-5">
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register("agreeToTerms")}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer transition-all active:scale-90"
              />
            </div>
            <label htmlFor="agreeToTerms" className="text-[11px] font-medium text-slate-500 cursor-pointer group-hover:text-slate-700 transition-colors leading-tight">
              I agree to the <Link href="#" className="text-emerald-600 font-bold hover:underline">Terms & Conditions</Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-[10px] font-bold text-red-500 pl-7 -mt-2">
              {errors.agreeToTerms.message}
            </p>
          )}

          <div className="flex items-start gap-3 group">
            <div className="relative flex items-center h-5">
              <input
                type="checkbox"
                id="agreeToPrivacy"
                {...register("agreeToPrivacy")}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer transition-all active:scale-90"
              />
            </div>
            <label htmlFor="agreeToPrivacy" className="text-[11px] font-medium text-slate-500 cursor-pointer group-hover:text-slate-700 transition-colors leading-tight">
              I agree to the <Link href="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreeToPrivacy && (
            <p className="text-[10px] font-bold text-red-500 pl-7 -mt-2">
              {errors.agreeToPrivacy.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <AuthButton type="submit" isLoading={signup.isPending}>
            Create Partner Account
          </AuthButton>
        </div>
      </form>

      <div className="mt-6 text-center text-[12px] font-medium text-slate-500">
        Already have a mart?{" "}
        <Link href="/" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-tight">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
