import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { setCredentials, setError, logout } from "@/lib/features/auth/authSlice";
import { AppDispatch } from "@/lib/store";
import { LoginInput, SignupInput, ForgotPasswordInput, ResetPasswordInput } from "@/validations/auth";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response: any) => {
      const { user } = response.data;
      dispatch(setCredentials({ user }));
      router.push('/dashboard');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      dispatch(setError(message));
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupInput & { name?: string; role?: string }) => authService.signup(data),
    onSuccess: (response: any) => {
      const { user } = response.data;
      dispatch(setCredentials({ user }));
      router.push('/dashboard');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      dispatch(setError(message));
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordInput) => authService.forgotPassword(data),
    onError: (err: any) => {
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      dispatch(setError(message));
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordInput & { token: string }) => authService.resetPassword(data),
    onSuccess: () => {
      router.push("/");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to reset password. Link may be expired.";
      dispatch(setError(message));
    }
  });

  const verifyResetCodeMutation = useMutation({
    mutationFn: (data: { email: string; code: string }) => authService.verifyResetCode(data),
    onError: (err: any) => {
      const message = err.response?.data?.message || "Invalid or expired verification code.";
      dispatch(setError(message));
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logout());
      router.push("/");
    },
  });

  return {
    login: loginMutation,
    signup: signupMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    verifyResetCode: verifyResetCodeMutation,
    logout: logoutMutation,
  };
};
