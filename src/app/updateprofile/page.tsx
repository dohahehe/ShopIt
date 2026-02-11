'use client'

import { useEffect } from "react";
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

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string(),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const router = useRouter();
  const { data: session, update } = useSession();
  
  const form = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Set form values from session
  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: (session.user as any)?.name || "",
        email: (session.user as any)?.email || "",
        phone: (session.user as any)?.phone || "",
      });
    }
  }, [session, form]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileForm) => {
      return userService.updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
    },
    onSuccess: async (response) => {
      const updatedUser = response.user;
      
      await update({
        user: {
          ...(session?.user as any),
          ...updatedUser,
          name: form.getValues("name"),
          email: form.getValues("email"),
          phone: form.getValues("phone"),
        }
      });

      toast.success("Profile updated successfully!");
      router.refresh();
      
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const onSubmit = (data: UpdateProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-4">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium text-green-600">Profile Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Profile</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Keep your personal information up to date
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mx-auto">
          {/* Form Card */}
          <div className="w-full sm:w-lg mx-auto">
            <Card className="w-full mx-auto border border-gray-200 rounded-2xl pt-0 shadow-sm overflow-hidden">
              <div className="bg-green-600 p-6">
                <CardTitle className="text-2xl text-white font-bold">Edit Profile</CardTitle>
                <p className="text-green-100 text-sm mt-1">
                  Update your name, email, and phone number
                </p>
              </div>
              
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    {/* Name */}
                    <Field>
                      <FieldLabel htmlFor="name" className="text-gray-900 font-medium">
                        Full Name
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <Input
                          id="name"
                          {...form.register("name")}
                          placeholder="John Doe"
                          className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={updateProfileMutation.isPending}
                        />
                      </div>
                      {form.formState.errors.name && (
                        <FieldError errors={[form.formState.errors.name]} />
                      )}
                    </Field>

                    {/* Email */}
                    <Field>
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
                          id="email"
                          type="email"
                          {...form.register("email")}
                          placeholder="example@gmail.com"
                          className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={updateProfileMutation.isPending}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <FieldError errors={[form.formState.errors.email]} />
                      )}
                    </Field>

                    {/* Phone */}
                    <Field>
                      <FieldLabel htmlFor="phone" className="text-gray-900 font-medium">
                        Phone Number
                      </FieldLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          {...form.register("phone")}
                          placeholder="01010700700"
                          className="ps-10 h-12 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={updateProfileMutation.isPending}
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <FieldError errors={[form.formState.errors.phone]} />
                      )}
                    </Field>
                  </div>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 p-6 pt-0">
                <Button 
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer disabled:opacity-50"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {updateProfileMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 w-full">
                  <Link 
                    href="/profile" 
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Profile
                  </Link>
                  
                  <Link 
                    href="/changepassword" 
                    className="text-sm text-green-600 hover:text-green-700 hover:underline"
                  >
                    Change Password →
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Profile Information</h3>
                    <p className="text-gray-600 text-sm">
                      Keep your name, email, and phone number current. This helps us verify your identity and contact you about your orders.
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
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Email Updates</h3>
                    <p className="text-gray-600 text-sm">
                      Your email is used for order confirmations, shipping updates, and account notifications. Make sure it's one you check regularly.
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
                      Your information is encrypted and secure. We never share your personal data with third parties without your consent.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200">
                  <div className="flex items-center gap-3 text-sm text-green-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Need to change your password?</span>
                    <Link 
                      href="/changepassword" 
                      className="font-medium text-green-700 underline hover:text-green-800"
                    >
                      Go to security settings
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