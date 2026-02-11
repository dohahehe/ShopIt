'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { addressService } from '@/services/addresses/addressService'

const addAddressSchema = z.object({
  name: z.string().min(1, 'Address name is required'),
  details: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string()
    .min(11, 'Phone number must be at least 11 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers'),
})

type AddAddressForm = z.infer<typeof addAddressSchema>

interface AddAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void  // Keep as onSuccess to match usage
}

export default function AddAddressModal({ 
  isOpen, 
  onClose, 
  onSuccess  // Keep as onSuccess
}: AddAddressModalProps) {
  const [showPhone, setShowPhone] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AddAddressForm>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      name: '',
      details: '',
      city: '',
      phone: '',
    },
  })

  const mutation = useMutation({
  mutationFn: (data: AddAddressForm) => {
    console.log("Submitting address data:", data); // Debug log
    return addressService.addAddress(
      data.name, 
      data.details, 
      data.phone, 
      data.city
    );
  },
  onSuccess: (response) => {
    console.log("Address added successfully:", response);
    toast.success(response.message || 'Address added successfully!');
    queryClient.invalidateQueries({ queryKey: ['addresses'] });
    form.reset();
    onSuccess();
    onClose();
  },
  onError: (error: Error) => {
    console.error("Failed to add address:", error);
    toast.error(error.message || 'Failed to add address');
  },
});

const onSubmit = (data: AddAddressForm) => {
  console.log("Form submitted with data:", data);
  mutation.mutate(data);
};

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50" 
        onClick={onClose} 
      />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="bg-green-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Add New Address</h3>
                  <p className="text-green-100 text-sm mt-1">Enter your shipping address details</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-white/80 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Address Name */}
              <Field>
                <FieldLabel htmlFor="name">Address Name</FieldLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Home, Work, etc."
                    className="ps-10 h-12"
                    disabled={mutation.isPending}
                  />
                </div>
                {form.formState.errors.name && (
                  <FieldError errors={[form.formState.errors.name]} />
                )}
              </Field>

              {/* Address Details */}
              <Field>
                <FieldLabel htmlFor="details">Street Address</FieldLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <Input
                    id="details"
                    {...form.register('details')}
                    placeholder="123 Main Street, Apt 4B"
                    className="ps-10 h-12"
                    disabled={mutation.isPending}
                  />
                </div>
                {form.formState.errors.details && (
                  <FieldError errors={[form.formState.errors.details]} />
                )}
              </Field>

              {/* City */}
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="Cairo, Giza, etc."
                    className="ps-10 h-12"
                    disabled={mutation.isPending}
                  />
                </div>
                {form.formState.errors.city && (
                  <FieldError errors={[form.formState.errors.city]} />
                )}
              </Field>

              {/* Phone */}
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <Input
                    id="phone"
                    type={showPhone ? 'text' : 'password'}
                    {...form.register('phone')}
                    placeholder="01010700700"
                    className="ps-10 h-12"
                    disabled={mutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                    onClick={() => setShowPhone(!showPhone)}
                  >
                    {showPhone ? (
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
                {form.formState.errors.phone && (
                  <FieldError errors={[form.formState.errors.phone]} />
                )}
                <p className="text-xs text-gray-500 mt-1">Enter 11+ digits without spaces or dashes</p>
              </Field>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full sm:flex-1 h-12 bg-green-600 hover:bg-green-700"
                >
                  {mutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    'Add Address'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={mutation.isPending}
                  className="w-full sm:flex-1 h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}