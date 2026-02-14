'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Loader from "@/Loader/Loader"
import Link from "next/link"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ErrorComponent from '../_components/Error/Error'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { addressService } from '@/services/addresses/addressService'
import getOrders from '@/services/orders/getOrders'
import { OrdersResponse } from '../types/orders'
import { AddressesResponse } from '../types/addresses'

// schemas
const addAddressSchema = z.object({
  name: z.string().min(1, 'Address name is required'),
  details: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string()
    .min(11, 'Phone number must be at least 11 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers'),
})

type AddAddressForm = z.infer<typeof addAddressSchema>

// add address modal
function AddAddressModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [showPhone, setShowPhone] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AddAddressForm>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: { name: '', details: '', city: '', phone: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: AddAddressForm) => 
      addressService.addAddress(data.name, data.details, data.phone, data.city), 
    onSuccess: () => {
      toast.success('Address added successfully!')
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      form.reset()
      onSuccess()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add address')
    },
  })

  const onSubmit = (data: AddAddressForm) => {
    mutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="bg-green-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Add New Address</h3>
                  <p className="text-green-100 text-sm mt-1">Enter your shipping address details</p>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
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
                  ) : 'Add Address'}
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

// main profile component
export default function Profile() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false)
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  
  // Get Orders Data
  const { 
    data: ordersData, 
    isLoading: ordersLoading, 
    isError: ordersError, 
    error: ordersErrorData 
  } = useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: getOrders
  })

  // Get Addresses Data
  const { 
    data: addressesData, 
    isLoading: addressesLoading,
    refetch: refetchAddresses 
  } = useQuery<AddressesResponse>({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
  })

  // Delete Address Mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: () => {
      toast.success('Address deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setDeletingAddressId(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete address')
      setDeletingAddressId(null)
    },
  })

  const handleDeleteAddress = (addressId: string) => {
    setDeletingAddressId(addressId)
    deleteAddressMutation.mutate(addressId)
  }

  const addresses = addressesData?.data || []
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0]
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.data || []
  const completedOrders = orders.filter(order => order.isDelivered)
  const pendingOrders = orders.filter(order => !order.isDelivered)  

  if (ordersLoading || addressesLoading) return <Loader />
  if (ordersError) return <ErrorComponent message={ordersErrorData.message} showContactButton={false} />
  
  if (status === 'unauthenticated') {
    return (
      <div className="w-full">
        <div className="w-full bg-white border-b">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-green-600">Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center py-8 sm:py-12 px-4 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Please Sign In</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-6 px-4">
              You need to be signed in to view and manage your profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">Sign In</Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const user = session?.user
  const userRole = (user as any)?.role || 'customer'
  const userPhone = (user as any)?.phone || 'Not provided'

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Add Address Modal */}
      <AddAddressModal 
        isOpen={isAddAddressModalOpen} 
        onClose={() => setIsAddAddressModalOpen(false)}
        onSuccess={refetchAddresses}
      />

      {/* Header */}
      <div className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full w-fit">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-green-600">Profile</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your profile, orders, and addresses</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Mobile Tabs */}
        <div className="xl:hidden overflow-x-auto pb-2 mb-6">
          <div className="flex gap-2 min-w-max">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
            <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label={`Orders (${orders.length})`} />
            <TabButton active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} label={`Addresses (${addresses.length})`} />
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Settings" />
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 xl:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden xl:block xl:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{user?.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <SidebarButton 
                  active={activeTab === 'overview'} 
                  onClick={() => setActiveTab('overview')} 
                  label="Profile Overview" 
                />
                <SidebarButton 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')} 
                  label={`My Orders (${orders.length})`} 
                />
                <SidebarButton 
                  active={activeTab === 'addresses'} 
                  onClick={() => setActiveTab('addresses')} 
                  label={`My Addresses (${addresses.length})`} 
                />
                <SidebarButton 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')} 
                  label="Account Settings" 
                />
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })} 
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 mt-4 pt-4 border-t cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-green-600 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl text-white font-bold">Profile Information</h2>
                  <p className="text-green-100 text-sm mt-1">Your personal account details</p>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Personal Details */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">Personal Details</h3>
                        <Link href='/updateprofile' className="text-sm text-green-600 hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Update
                        </Link>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Email</p>
                          <p className="font-medium break-all">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{userPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Account Type</p>
                          <Badge className={`mt-1 ${
                            userRole === 'admin' ? 'bg-purple-50 text-purple-700' : 
                            userRole === 'vendor' ? 'bg-blue-50 text-blue-700' : 
                            'bg-green-50 text-green-700'
                          }`}>
                            {userRole === 'admin' ? 'Administrator' : userRole === 'vendor' ? 'Vendor' : 'Customer'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Order Stats */}
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                          </div>
                          <Link href="/order-confirmation/allorders">
                            <Button className='cursor-pointer' variant="outline" size="sm">View All</Button>
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-700">Completed</p>
                            <p className="text-xl font-bold text-green-900">{completedOrders.length}</p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-xs text-yellow-700">Pending</p>
                            <p className="text-xl font-bold text-yellow-900">{pendingOrders.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Default Address Preview */}
                    {defaultAddress && (
                      <div className="md:col-span-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-green-900 flex items-center gap-2">
                                Default Address
                                <Badge className="bg-green-100 text-green-700">{defaultAddress.name}</Badge>
                              </p>
                              <p className="text-sm text-green-700 mt-1">{defaultAddress.details}, {defaultAddress.city}</p>
                              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {defaultAddress.phone}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-300 text-green-700 hover:bg-green-50 cursor-pointer"
                            onClick={() => setActiveTab('addresses')}
                          >
                            Manage Addresses
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Security */}
                    <div className="md:col-span-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-green-900">Account Security</p>
                            <p className="text-sm text-green-700 mt-1">Update your password regularly to keep your account secure.</p>
                          </div>
                        </div>
                          <Button onClick={() => setActiveTab('settings')}  variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50 cursor-pointer">
                            Change Password
                          </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-green-600 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl text-white font-bold">Order History</h2>
                  <p className="text-green-100 text-sm mt-1">Your past orders ({orders.length})</p>
                </div>
                <div className="p-4 sm:p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-sm text-gray-600 mb-6">You haven't placed any orders yet.</p>
                      <Link href="/">
                        <Button className="bg-green-600 hover:bg-green-700">Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg overflow-hidden">
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</h3>
                                  <Badge className={order.isPaid ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}>
                                    {order.isPaid ? 'Paid' : 'Pending'}
                                  </Badge>
                                  <Badge className={order.isDelivered ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}>
                                    {order.isDelivered ? 'Delivered' : 'Processing'}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                  <span>{order.totalOrderPrice.toFixed(2)} EGP</span>
                                  <span className="capitalize">{order.paymentMethodType}</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                className="w-full sm:w-auto"
                              >
                                {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                              </Button>
                            </div>
                          </div>
                          {selectedOrder === order._id && (
                            <div className="p-4 sm:p-6 border-t bg-gray-50">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Shipping Address
                                  </h4>
                                  <div className="bg-white p-3 rounded-lg border text-sm">
                                    <p>{order.shippingAddress?.details}</p>
                                    <p className="text-gray-600">{order.shippingAddress?.city}</p>
                                    <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Items
                                  </h4>
                                  <div className="space-y-2">
                                    {order.cartItems?.map((item: any) => (
                                      <div key={item._id} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                                        <div className="w-12 h-12 rounded bg-gray-100 shrink-0">
                                          {item.product?.imageCover && (
                                            <img 
                                              src={item.product.imageCover} 
                                              alt={item.product.title} 
                                              className="w-full h-full object-cover rounded" 
                                            />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm truncate">{item.product?.title}</p>
                                          <p className="text-xs text-gray-600">Qty: {item.count} × {item.price} EGP</p>
                                        </div>
                                        <div className="font-bold text-sm">
                                          {(item.price * item.count).toFixed(2)} EGP
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="font-semibold">Total</span>
                                  <span className="font-bold text-lg">{order.totalOrderPrice.toFixed(2)} EGP</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-green-600 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl text-white font-bold">My Addresses</h2>
                      <p className="text-green-100 text-sm mt-1">Manage your shipping addresses</p>
                    </div>
                    <Button 
                      className="bg-white text-green-600 hover:bg-green-50 w-full sm:w-auto cursor-pointer"
                      onClick={() => setIsAddAddressModalOpen(true)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Address
                    </Button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  {addresses.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Addresses Yet</h3>
                      <p className="text-sm text-gray-600 mb-6">Add your first shipping address to speed up checkout.</p>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 cursor-pointer"
                        onClick={() => setIsAddAddressModalOpen(true)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div 
                          key={address._id} 
                          className={`p-4 border rounded-lg ${
                            address.isDefault ? 'border-green-500 bg-green-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={address.isDefault ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {address.name}
                              </Badge>
                              {address.isDefault && (
                                <Badge className="bg-green-500 text-white">Default</Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => handleDeleteAddress(address._id)}
                                disabled={deleteAddressMutation.isPending && deletingAddressId === address._id}
                                className="p-1.5 hover:bg-red-100 rounded-lg cursor-pointer text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete address"
                              >
                                {deleteAddressMutation.isPending && deletingAddressId === address._id ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-900">{address.details}</p>
                            <p className="text-gray-600">{address.city}</p>
                            <p className="text-gray-600 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {address.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-green-600 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl text-white font-bold">Account Settings</h2>
                  <p className="text-green-100 text-sm mt-1">Manage your account preferences</p>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="p-4 border rounded-lg">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Change Password</h3>
                          <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure.</p>
                        </div>
                      </div>
                      <Link href="/changepassword" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 cursor-pointer">
                          Change Password
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// helper components
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap cursor-pointer ${
        active ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )
}

function SidebarButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
        active ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      <span className="font-medium">{label}</span>
    </button>
  )
}