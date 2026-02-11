'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import * as z from "zod";

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { userService } from "@/services/userService";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  password: z.string().min(6, "New password must be at least 6 characters"),
  rePassword: z.string().min(6, "Please confirm your new password"),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordForm) => 
      userService.changePassword(data.currentPassword, data.password, data.rePassword),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      form.reset();
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-4">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium text-green-600">Security</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Update your password to keep your account secure
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mx-auto">
          {/* Form Card */}
          <div className="w-full sm:w-lg mx-auto">
            <Card className="w-full mx-auto border border-gray-200 rounded-2xl pt-0 shadow-sm overflow-hidden">
              <div className="bg-green-600 p-6">
                <CardTitle className="text-2xl text-white font-bold">Change Password</CardTitle>
                <p className="text-green-100 text-sm mt-1">
                  Enter your current password and choose a new one
                </p>
              </div>
              
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <Field>
                      <FieldLabel htmlFor="currentPassword" className="text-gray-900 font-medium">
                        Current Password
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <Input
                          id="currentPassword"
                          type={showCurrentPass ? 'text' : 'password'}
                          {...form.register("currentPassword")}
                          placeholder="Enter current password"
                          className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={changePasswordMutation.isPending}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer hover:text-gray-700 transition-colors"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                        >
                          {showCurrentPass ? (
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
                      {form.formState.errors.currentPassword && (
                        <FieldError errors={[form.formState.errors.currentPassword]} />
                      )}
                    </Field>

                    {/* New Password */}
                    <Field>
                      <FieldLabel htmlFor="password" className="text-gray-900 font-medium">
                        New Password
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <Input
                          id="password"
                          type={showNewPass ? 'text' : 'password'}
                          {...form.register("password")}
                          placeholder="Enter new password"
                          className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={changePasswordMutation.isPending}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer hover:text-gray-700 transition-colors"
                          onClick={() => setShowNewPass(!showNewPass)}
                        >
                          {showNewPass ? (
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
                      {form.formState.errors.password && (
                        <FieldError errors={[form.formState.errors.password]} />
                      )}
                    </Field>

                    {/* Confirm Password */}
                    <Field>
                      <FieldLabel htmlFor="rePassword" className="text-gray-900 font-medium">
                        Confirm New Password
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <Input
                          id="rePassword"
                          type={showConfirmPass ? 'text' : 'password'}
                          {...form.register("rePassword")}
                          placeholder="Confirm new password"
                          className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={changePasswordMutation.isPending}
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
                      {form.formState.errors.rePassword && (
                        <FieldError errors={[form.formState.errors.rePassword]} />
                      )}
                    </Field>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 p-6 pt-0">
                <Button 
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer disabled:opacity-50"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {changePasswordMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Changing Password...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </Button>

                <div className="flex items-center justify-start pt-4 border-t border-gray-100 w-full">
                  <Link 
                    href="/profile" 
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Profile
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Info Section - Matching Forgot Password Style */}
          <div className="w-full sm:w-lg mx-auto block">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Password Tips</h3>
                    <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                      <li>Use at least 6 characters</li>
                      <li>Mix letters, numbers & symbols</li>
                      <li>Avoid using personal information</li>
                      <li>Don't reuse passwords from other sites</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Keep Your Account Safe</h3>
                    <p className="text-gray-600 text-sm">
                      Never share your password with anyone. Enable two-factor authentication for extra security if available.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Forgot Your Password?</h3>
                    <p className="text-gray-600 text-sm">
                      If you can't remember your current password, you'll need to log out and use the "Forgot Password" option on the login page.
                    </p>
                    <Link 
                      href="/forgotpassword" 
                      className="inline-block mt-2 text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                      Reset forgotten password →
                    </Link>
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