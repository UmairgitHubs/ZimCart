"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { forgotPasswordSchema, ForgotPasswordInput, verifyCodeSchema, VerifyCodeInput } from "@/validations/auth";
import { RootState } from "@/lib/store";
import { setError } from "@/lib/features/auth/authSlice";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { forgotPassword, verifyResetCode } = useAuth();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const otpForm = useForm<VerifyCodeInput>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onEmailSubmit: SubmitHandler<ForgotPasswordInput> = (data) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        otpForm.reset(); // Clear any browser-filled junk
        dispatch(setError(null));
      }
    });
  };

  const onOtpSubmit: SubmitHandler<VerifyCodeInput> = (data) => {
    verifyResetCode.mutate({ email: submittedEmail, code: data.code }, {
      onSuccess: (response: any) => {
        // Response contains { token, message }
        router.push(`/reset-password?token=${response.data.token}`);
      }
    });
  };

  return (
    <AuthLayout>
      <AuthHeader 
        title={isSubmitted ? "Verify Code" : "Recover Password"} 
        subtitle={isSubmitted ? `Enter the 6-digit code sent to ${submittedEmail}` : "We'll send you a verification code to reset your account"} 
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600 animate-in shake-1">
          {error}
        </div>
      )}

      {!isSubmitted ? (
        <form key="email-form" onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
          <AuthInput
            label="Business Email"
            type="email"
            placeholder="partner@zimcart.com"
            error={emailForm.formState.errors.email?.message}
            {...emailForm.register("email")}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <AuthButton type="submit" isLoading={forgotPassword.isPending}>
            Send Verification Code
          </AuthButton>
        </form>
      ) : (
        <form key="otp-form" onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
          <AuthInput
            label="Verification Code"
            type="text"
            placeholder="000000"
            maxLength={6}
            error={otpForm.formState.errors.code?.message}
            {...otpForm.register("code")}
            inputClassName="text-center text-2xl tracking-[1em] font-black pl-4"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d*"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a9.994 9.994 0 001.214-19.182m-7.214 14.9a6.118 6.118 0 01-1.801-4.411m11.1-1.1c.328 1.02.5 2.107.5 3.226a10.038 10.038 0 01-1.043 4.411m-6.433-8.176a.591.591 0 01-.1-.365V9.75c0-.635.374-1.2 1.055-1.547l3.208-1.604a.591.591 0 01.81.503v1.86c0 .195-.121.365-.312.428l-4.66 1.554z" />
              </svg>
            }
          />

          <AuthButton type="submit" isLoading={verifyResetCode.isPending}>
            Verify & Continue
          </AuthButton>

          <button 
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="w-full text-center text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            ← Back to email
          </button>
        </form>
      )}

      {!isSubmitted && (
        <div className="mt-8 text-center text-[13px] font-medium text-slate-500">
          Remember your password?{" "}
          <Link href="/" className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-tight">
            Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
