'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Loader from "@/Loader/Loader"
import toast from "react-hot-toast"
import Link from "next/link"
import { CartResponse } from "../types/cart-response"
import { checkoutSchema } from "@/schema/checkoutSchema"
import { createCashOrder, createCheckoutSession } from '@/services/orders/createOrder'
import ErrorComponent from '../_components/Error/Error'
import { Badge } from "@/components/ui/badge"

type PaymentMethod = 'cash' | 'online' | null

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null)
  
  // Get Cart Data
  const { data: cartData, isLoading, isError, error } = useQuery<CartResponse>({
    queryKey: ['get-cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart')
      return response.json()
    }
  })

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city: '',
      streetAddress: '',
      phone: '',
    },
    mode: 'onBlur'
  })

  const handlePlaceOrder = async (paymentMethod: PaymentMethod) => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = form.getValues();
    
    try {
      setIsProcessing(true);

      const shippingAddress = {
        details: formData.streetAddress,
        phone: formData.phone,
        city: formData.city
      };

      const cartId = cartData?.data._id;

      if (!cartId) {
        throw Object.assign(new globalThis.Error('Cart ID not found'), {});
      }

      if (paymentMethod === 'cash') {
        // Cash on delivery
        const result = await createCashOrder({
          cartId,
          shippingAddress
        });
        
        toast.success('Order placed successfully!');
        router.push("/order-confirmation/allorders");
        
      } else if (paymentMethod === 'online') {
        // Online payment
        const result = await createCheckoutSession({
          cartId,
          shippingAddress
        });
        
        // Redirect to payment gateway
        if (result.session?.url || result.url) {
          window.location.href = result.session?.url || result.url;
        } else {
          throw Object.assign(new globalThis.Error('No payment URL received'), {});
        }
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to process order');
      console.error('Order processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) return <Loader />
  
  if (isError) return <ErrorComponent message={error.message} showContactButton={false} />
  
  if (!cartData || cartData?.numOfCartItems === 0) {
    return (
      <div className="w-full">
        <div className="w-full bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full">
                  <svg 
                    className="w-4 h-4 text-green-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-600">Checkout</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600 max-w-2xl">
                Complete your purchase
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Your cart is empty
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Add some items to your cart before checking out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
                  Browse Products
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="cursor-pointer">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cart = cartData?.data
  const products = cart?.products || []
  const totalCartPrice = cart?.totalCartPrice || 0
  const shippingCost = totalCartPrice >= 500 ? 0 : 60
  const totalOrderPrice = totalCartPrice + shippingCost

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full">
                <svg 
                  className="w-4 h-4 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">Checkout</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
            <p className="text-gray-600 max-w-2xl">
              Review your items and enter shipping details ({cartData?.numOfCartItems} {cartData?.numOfCartItems === 1 ? 'item' : 'items'})
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{cartData?.numOfCartItems} Items</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{totalOrderPrice.toFixed(2)} EGP Total</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                {totalCartPrice >= 500 ? 'Free Shipping' : `${shippingCost} EGP Shipping`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address Form */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            <div className="bg-green-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h2 className="text-2xl text-white font-bold">Shipping Address</h2>
                  <p className="text-green-100 text-sm mt-1">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <form id="checkout-form" className="space-y-6">
                {/* City Field */}
                <div className="space-y-2">
                  <label htmlFor="city" className="text-gray-900 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    City *
                  </label>
                  <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          id="city"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your city"
                          className={`w-full h-12 rounded-lg border ${
                            fieldState.invalid 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                          }`}
                        />
                        {fieldState.invalid && (
                          <p className="text-red-600 text-sm mt-1">{fieldState.error?.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-gray-900 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number *
                  </label>
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your phone number"
                          className={`w-full h-12 rounded-lg border ${
                            fieldState.invalid 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                          }`}
                        />
                        {fieldState.invalid && (
                          <p className="text-red-600 text-sm mt-1">{fieldState.error?.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Street Address Field */}
                <div className="space-y-2">
                  <label htmlFor="streetAddress" className="text-gray-900 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Street Address *
                  </label>
                  <Controller
                    name="streetAddress"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          id="streetAddress"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your street address"
                          className={`w-full h-12 rounded-lg border ${
                            fieldState.invalid 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                          }`}
                        />
                        {fieldState.invalid && (
                          <p className="text-red-600 text-sm mt-1">{fieldState.error?.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            <div className="bg-green-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h2 className="text-2xl text-white font-bold">Payment Method</h2>
                  <p className="text-green-100 text-sm mt-1">
                    Choose how you want to pay for your order
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cash on Delivery Button */}
                <div 
                  onClick={() => setSelectedPaymentMethod('cash')}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === 'cash' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'cash' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'cash' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <svg 
                          className={`w-6 h-6 ${selectedPaymentMethod === 'cash' ? 'text-green-600' : 'text-gray-400'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Cash on Delivery</h3>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 mt-2">
                        No extra fees
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Online Payment Button */}
                <div 
                  onClick={() => setSelectedPaymentMethod('online')}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === 'online' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'online' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'online' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <svg 
                          className={`w-6 h-6 ${selectedPaymentMethod === 'online' ? 'text-green-600' : 'text-gray-400'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Online Payment</h3>
                          <p className="text-sm text-gray-600">Pay securely with your card</p>
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 mt-2">
                        Secure & encrypted
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Security Note */}
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-green-800 font-medium">100% Secure Payment</p>
                    <p className="text-green-700 text-sm mt-1">
                      Your payment information is protected with 256-bit SSL encryption. 
                      We never store your card details on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            <div className="bg-green-600 p-6">
              <h2 className="text-2xl text-white font-bold">Order Summary</h2>
              <p className="text-green-100 text-sm mt-1">
                {cartData?.numOfCartItems} {cartData?.numOfCartItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6 max-h-72 overflow-y-auto pr-2">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Items in your order
                </h3>
                <div className="space-y-4">
                  {products?.map((product) => (
                    <div key={product?._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {product?.product?.imageCover ? (
                          <img 
                            src={product?.product?.imageCover} 
                            alt={product?.product?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product?.product?.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            Qty: {product?.count}
                          </Badge>
                          {product?.product?.category?.name && (
                            <Badge className="bg-green-50 text-green-700 text-xs">
                              {product?.product?.category?.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        {(product?.count * product?.price).toFixed(2)} EGP
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{totalCartPrice.toFixed(2)} EGP</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">Shipping</span>
                    {totalCartPrice >= 500 && (
                      <Badge className="bg-green-50 text-green-700">
                        Free
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    {totalCartPrice >= 500 ? (
                      <span className="font-medium text-green-600">Free</span>
                    ) : (
                      <span className="font-medium">60.00 EGP</span>
                    )}
                  </div>
                </div>

                {totalCartPrice < 500 && (
                  <div className="mt-4 mb-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between text-sm text-green-800 mb-2">
                      <span>Free shipping at 500 EGP</span>
                      <span className="font-medium">{totalCartPrice.toFixed(2)} / 500 EGP</span>
                    </div>
                    <div className="w-full bg-green-100 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((totalCartPrice / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Add <span className="font-bold">{(500 - totalCartPrice).toFixed(2)} EGP</span> more for free shipping
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      {totalCartPrice >= 500 && (
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span>You saved 60 EGP on shipping!</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {totalOrderPrice.toFixed(2)} EGP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0">
              <div className="space-y-3">
                {/* Place Order Button */}
                <Button
                  onClick={() => handlePlaceOrder(selectedPaymentMethod)}
                  disabled={isProcessing || !selectedPaymentMethod}
                  className={`w-full h-14 font-bold text-lg cursor-pointer ${
                    isProcessing || !selectedPaymentMethod
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Order...
                    </div>
                  ) : selectedPaymentMethod === 'cash' ? (
                    `Place Order - ${totalOrderPrice.toFixed(2)} EGP`
                  ) : selectedPaymentMethod === 'online' ? (
                    `Pay Now - ${totalOrderPrice.toFixed(2)} EGP`
                  ) : (
                    'Select Payment Method'
                  )}
                </Button>

                <Link href="/cart" className="w-full block">
                  <Button variant="outline" className="w-full h-12 cursor-pointer hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Return to Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Order Support</span>
            </div>
            
            <h3 className="text-xl font-bold mb-6">
              Need Help With Your Order?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Quality Guarantee</h4>
                  <p className="text-gray-300 text-sm">
                    Every product is carefully curated and quality checked by our experts.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Fast Delivery</h4>
                  <p className="text-gray-300 text-sm">
                    Free shipping on orders over 500 EGP. 1-3 business days delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}