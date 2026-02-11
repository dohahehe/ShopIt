'use client'
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/schema/loginSchema";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callback-url');

  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: 'onBlur'
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl ?? '/',
      redirect: false
    });
    
    if (res?.ok) {
      toast.success('Logged in successfully!');
      window.location.href = res.url || '/';
    } else {
      toast.error('Invalid email or password');
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-4">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium text-green-600">Welcome Back</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In to Your Account</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Access your personalized shopping experience and manage your orders
          </p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8 items-center mx-auto">

          {/* Login Form */}
          <div className="w-full sm:w-lg mx-auto">
            <Card className="w-full mx-auto border border-gray-200 rounded-2xl pt-0 shadow-sm overflow-hidden">
              <div className="bg-green-600 p-6">
                <CardTitle className="text-2xl text-white font-bold">Sign In</CardTitle>
                <p className="text-green-100 text-sm mt-1">
                  Enter your credentials to access your account
                </p>
              </div>
              
              <CardContent className="p-6">
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup className="space-y-2">
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="form-rhf-demo-email" className="text-gray-900 font-medium">
                            Email Address
                          </FieldLabel>
                          <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                              </svg>
                            </div>
                            <Input
                              {...field}
                              id="form-rhf-demo-email"
                              aria-invalid={fieldState.invalid}
                              placeholder="example@gmail.com"
                              className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />                  
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="form-rhf-demo-password" className="text-gray-900 font-medium">
                              Password
                            </FieldLabel>
                            <Link 
                              href="/forgotpassword" 
                              className="text-sm text-green-600 hover:text-green-700 hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                              <svg 
                                className="w-5 h-5 text-gray-400" 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                width={24} 
                                height={24} 
                                fill="none" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  stroke="currentColor" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                                />
                              </svg>                    
                            </div>
                            <Input
                              {...field}
                              id="form-rhf-demo-password"
                              type={showPass ? 'text' : 'password'}
                              aria-invalid={fieldState.invalid}
                              placeholder="Enter your password"
                              className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />  
                            <button
                              type="button"
                              className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer hover:text-gray-700 transition-colors"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? (
                                <svg 
                                  className="w-5 h-5 text-gray-500" 
                                  aria-hidden="true" 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width={24} 
                                  height={24} 
                                  fill="none" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    stroke="currentColor" 
                                    strokeWidth={2} 
                                    d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                  />
                                  <path 
                                    stroke="currentColor" 
                                    strokeWidth={2} 
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                              ) : (
                                <svg 
                                  className="w-5 h-5 text-gray-500" 
                                  aria-hidden="true" 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width={24} 
                                  height={24} 
                                  fill="none" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    stroke="currentColor" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                              )}
                            </button>             
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 p-6 pt-0">
                <Button 
                  disabled={isLoading} 
                  className="w-full h-12 rounded-lg bg-green-600 hover:from-green-700 text-white font-medium cursor-pointer"
                  type="submit" 
                  form="form-rhf-demo"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      href="/register" 
                      className="font-medium text-green-600 hover:text-green-700 hover:underline"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="w-full sm:w-lg mx-auto block">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Track Your Orders</h3>
                    <p className="text-gray-600 text-sm">
                      Monitor your purchases and delivery status in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Secure Account</h3>
                    <p className="text-gray-600 text-sm">
                      Your data is protected with industry-standard encryption
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Personalized Experience</h3>
                    <p className="text-gray-600 text-sm">
                      Get recommendations tailored to your preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}