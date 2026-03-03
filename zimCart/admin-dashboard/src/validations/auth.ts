import * as z from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid business email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password is too long"),
  rememberMe: z.boolean(),
});

export const signupSchema = z.object({
  martName: z.string()
    .min(3, "Mart name is too short")
    .max(50, "Mart name is too long")
    .regex(/^[a-zA-Z0-9 ]+$/, "Special characters are not allowed in Mart name"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid business email"),
  phone: z.string()
    .regex(/^(\+92|0|92)?3\d{9}$/, "Please enter a valid phone number (e.g. 0325...)"),
  country: z.string().min(1, "Country is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions",
  }),
  agreeToPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid business email"),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
    .min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const verifyCodeSchema = z.object({
  code: z.string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
