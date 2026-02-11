'use client'

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { 
  emailSchema, 
  resetCodeSchema, 
  newPasswordSchema,
  type EmailForm, 
  type ResetCodeForm, 
  type NewPasswordForm 
} from "@/schema/forgotPasswordSchema";
import { authService } from "@/services/authService";

type Step = "email" | "code" | "password";

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callback-url');
  
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Email Form
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
    mode: 'onBlur'
  });

  // Reset Code Form
  const codeForm = useForm<ResetCodeForm>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: { resetCode: "" },
    mode: 'onBlur'
  });

  // New Password Form
  const passwordForm = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      rePassword: "",
    },
    mode: 'onBlur'
  });

  // 1. forgot pass
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (data, variables) => {
      toast.success("Reset code sent to your email!");
      setEmail(variables);
      setStep("code");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset code");
    },
  });

  // 2. verify
  const verifyCodeMutation = useMutation({
    mutationFn: ({ resetCode, email }: { resetCode: string; email: string }) => 
      authService.verifyResetCode(resetCode, email),
    onSuccess: () => {
      toast.success("Code verified successfully!");
      setStep("password");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid verification code");
    },
  });

  // 3. reset
  const resetPasswordMutation = useMutation({
    mutationFn: ({ newPassword, rePassword }: { newPassword: string; rePassword: string }) => 
      authService.resetPassword(newPassword, rePassword),
    onSuccess: () => {
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push(callbackUrl ? decodeURIComponent(callbackUrl) : '/login');
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  const onEmailSubmit = (data: EmailForm) => {
    forgotPasswordMutation.mutate(data.email);
  };

  const onCodeSubmit = (data: ResetCodeForm) => {
    verifyCodeMutation.mutate({
      resetCode: data.resetCode,
      email: email,
    });
  };

  const onPasswordSubmit = (data: NewPasswordForm) => {
    resetPasswordMutation.mutate({
      newPassword: data.password,
      rePassword: data.rePassword,
    });
  };

  const handleResendCode = () => {
    forgotPasswordMutation.mutate(email);
  };

  const isLoading = 
    forgotPasswordMutation.isPending || 
    verifyCodeMutation.isPending || 
    resetPasswordMutation.isPending;

  return (
    <div className="min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-4">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="text-sm font-medium text-green-600">
              {step === "email" && "Reset Password"}
              {step === "code" && "Verify Code"}
              {step === "password" && "Create New Password"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "email" && "Forgot Your Password?"}
            {step === "code" && "Check Your Email"}
            {step === "password" && "Set New Password"}
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            {step === "email" && "Enter your email address and we'll send you a verification code"}
            {step === "code" && `We sent a 6-digit code to ${email || 'your email'}`}
            {step === "password" && "Create a strong password that you don't use on other sites"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8 items-center mx-auto">
          {/* Form Card */}
          <div className="w-full sm:w-lg mx-auto">
            <Card className="w-full mx-auto border border-gray-200 rounded-2xl pt-0 shadow-sm overflow-hidden">
              <div className="bg-green-600 p-6">
                <CardTitle className="text-2xl text-white font-bold">
                  {step === "email" && "Reset Password"}
                  {step === "code" && "Verify Code"}
                  {step === "password" && "New Password"}
                </CardTitle>
                <p className="text-green-100 text-sm mt-1">
                  {step === "email" && "We'll send a verification code to your email"}
                  {step === "code" && "Enter the 6-digit code from your email"}
                  {step === "password" && "Choose a new password for your account"}
                </p>
              </div>
              
              <CardContent className="px-6 py-4">
                {/* Email Step */}
                {step === "email" && (
                  <form id="email-form" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                    <FieldGroup className="space-y-2">
                      <Controller
                        name="email"
                        control={emailForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email" className="text-gray-900 font-medium">
                              Email Address
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <Input
                                {...field}
                                id="email"
                                type="email"
                                aria-invalid={fieldState.invalid}
                                placeholder="example@gmail.com"
                                className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                disabled={forgotPasswordMutation.isPending}
                              />
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </form>
                )}

                {/* Code Step */}
                {step === "code" && (
                  <form id="code-form" onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
                    <FieldGroup className="space-y-2">
                      <Controller
                        name="resetCode"
                        control={codeForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="resetCode" className="text-gray-900 font-medium">
                              Verification Code
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                              </div>
                              <Input
                                {...field}
                                id="resetCode"
                                placeholder="000000"
                                maxLength={6}
                                aria-invalid={fieldState.invalid}
                                className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 text-center text-lg tracking-widest"
                                disabled={verifyCodeMutation.isPending}
                              />
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep("email")}
                          className="text-sm cursor-pointer text-gray-600 hover:text-gray-900 hover:underline flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={forgotPasswordMutation.isPending}
                          className="text-sm cursor-pointer text-green-600 hover:text-green-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {forgotPasswordMutation.isPending ? "Sending..." : "Resend code"}
                        </button>
                      </div>
                    </FieldGroup>
                  </form>
                )}

                {/* Password Step */}
                {step === "password" && (
                  <form id="password-form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <FieldGroup className="space-y-2">
                      <Controller
                        name="password"
                        control={passwordForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="new-password" className="text-gray-900 font-medium">
                              New Password
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <Input
                                {...field}
                                id="new-password"
                                type={showPass ? 'text' : 'password'}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter new password"
                                className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                disabled={resetPasswordMutation.isPending}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer hover:text-gray-700 transition-colors"
                                onClick={() => setShowPass(!showPass)}
                              >
                                {showPass ? (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        name="rePassword"
                        control={passwordForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="confirm-password" className="text-gray-900 font-medium">
                              Confirm Password
                            </FieldLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <Input
                                {...field}
                                id="confirm-password"
                                type={showConfirmPass ? 'text' : 'password'}
                                aria-invalid={fieldState.invalid}
                                placeholder="Confirm new password"
                                className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                disabled={resetPasswordMutation.isPending}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer hover:text-gray-700 transition-colors"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                              >
                                {showConfirmPass ? (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <div className="pt-0">
                        <button
                          type="button"
                          onClick={() => setStep("code")}
                          className="text-sm cursor-pointer text-gray-600 hover:text-gray-900 hover:underline flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to verification
                        </button>
                      </div>
                    </FieldGroup>
                  </form>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 p-6 pt-0">
                <Button 
                  disabled={isLoading} 
                  className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit" 
                  form={
                    step === "email" ? "email-form" : 
                    step === "code" ? "code-form" : 
                    "password-form"
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {forgotPasswordMutation.isPending && "Sending..."}
                      {verifyCodeMutation.isPending && "Verifying..."}
                      {resetPasswordMutation.isPending && "Resetting..."}
                    </div>
                  ) : (
                    <>
                      {step === "email" && "Send Reset Code"}
                      {step === "code" && "Verify Code"}
                      {step === "password" && "Reset Password"}
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link 
                      href="/login" 
                      className="font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                      Back to login
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Info Section */}
          <div className="w-full sm:w-lg mx-auto block">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Secure Reset</h3>
                    <p className="text-gray-600 text-sm">
                      Your verification code is sent securely to your registered email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Quick & Easy</h3>
                    <p className="text-gray-600 text-sm">
                      Reset your password in just a few simple steps
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Account Protection</h3>
                    <p className="text-gray-600 text-sm">
                      We'll help you regain access while keeping your account secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}