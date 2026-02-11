import * as z from "zod";

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetCodeSchema = z.object({
  resetCode: z.string()
    .min(5, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const newPasswordSchema = z.object({
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  rePassword: z.string()
    .min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});

export type EmailForm = z.infer<typeof emailSchema>;
export type ResetCodeForm = z.infer<typeof resetCodeSchema>;
export type NewPasswordForm = z.infer<typeof newPasswordSchema>;