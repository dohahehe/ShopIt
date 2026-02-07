'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { CartResponse } from "../types/cart-response"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Loader from "@/Loader/Loader"
import deleteCartItem from "@/services/cart/delete-cart-item"
import toast from "react-hot-toast"
import updateCartItem from "@/services/cart/update-cart"
import emptyCart from "@/services/cart/empty-cart"
import { useState } from "react"

export default function Cart() {  
  const queryClient = useQueryClient()
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  // Get Cart Data
  const { data: cartData, isLoading, isError, error } = useQuery<CartResponse>({
    queryKey: ['get-cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart')
      if (!response.ok) throw new Error('Failed to fetch cart')
      return response.json()
    }
  })

  // Update quantity - FIXED: Track specific item being updated
  const {mutate:updateCart, isPending:updateLoading} = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      toast.success('Product updated!');
      queryClient.invalidateQueries({queryKey:['get-cart']});
      setUpdatingItemId(null)
    },
    onError: () => {
      toast.error('error updating!')
      setUpdatingItemId(null)
    }
  })

  function handleUpdate(productId: string, count: number){
    setUpdatingItemId(productId)
    updateCart({productId, count})
  }

  // Remove Item
  const {mutate:removeCartItem, isPending:removeLoading} = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      toast.success('Product deleted!');
      queryClient.invalidateQueries({queryKey:['get-cart']});
      setRemovingItemId(null)
    },
    onError: () => {
      toast.error('error deleting!')
      setRemovingItemId(null)
    }
  })

  function handleRemove(productId: string) {
    setRemovingItemId(productId)
    removeCartItem(productId)
  }
  
  // Clear cart
  const {mutate:empty, isPending:emptyLoading} = useMutation({
    mutationFn: emptyCart,
    onSuccess: () => {
      toast.success('Cart emptied!');
      queryClient.invalidateQueries({ queryKey: ['get-cart'] })
    },
    onError: () => {
      toast.error('error emptying cart!')
    }
  })

  if (isLoading) return <Loader />
  
  if (isError) return (
    <div className="w-full p-8 text-center">
      <p className="flex gap-3 mx-auto text-center justify-center">
        <span>
            <svg xmlns="http://www.w3.org" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={12} cy={12} r={10} />
            <line x1={15} y1={9} x2={9} y2={15} />
            <line x1={9} y1={9} x2={15} y2={15} />
            </svg>
        </span>
        {error?.message}
      </p>
    </div>
  )
  
  if (!cartData || cartData?.numOfCartItems === 0) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="w-full bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                  <span className="text-sm font-medium text-green-600">Shopping Cart</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
              <p className="text-gray-600 max-w-2xl">
                Review and manage your items
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
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
              Add some items to get started. Browse our products to find something you'll love.
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

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                <span className="text-sm font-medium text-green-600">Shopping Cart</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
            <p className="text-gray-600 max-w-2xl">
              Review and manage your items ({cartData?.numOfCartItems} {cartData?.numOfCartItems === 1 ? 'item' : 'items'})
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
              <span className="font-medium">{totalCartPrice.toFixed(2)} EGP Total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {products?.map((product) => {
              const isUpdatingThisItem = updatingItemId === product?.product?._id
              const isRemovingThisItem = removingItemId === product?.product?._id
              
              return (
                <div key={product?._id} className="relative w-full group rounded-lg border-0 bg-white shadow-md p-4 flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    {/* Product Image */}
                    <div className="w-32 h-full rounded flex items-center justify-center overflow-hidden">
                      {product?.product?.imageCover ? (
                        <img 
                          src={product?.product?.imageCover} 
                          alt={product?.product?.title || 'Product'}
                          className="w-full h-full object-cover rounded group-hover:scale-110 duration-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-3xl">📦</span>
                      )}
                    </div>
                    {product?.product?.quantity > 0 && 
                      <p className="flex text-sm items-center gap-1 text-gray-500">
                        <svg 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mt-1"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>in stock</span>
                      </p> 
                    }
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 justify-between">
                   <div className="flex flex-col justify-between h-full">
                     <h3 title={product?.product?.title} className="font-semibold line-clamp-1 text-lg group-hover:text-green-700 duration-300">
                       {product?.product?.title}
                     </h3>
                    {product?.product?.category?.name && (
                      <Badge className="bg-green-50 text-green-700 mt-2 ms-0">
                        {product?.product?.category?.name}
                      </Badge>
                    )}
                   
                    <div className="grid grid-cols-1 sm:grid-cols-2 mt-auto relative bottom-0">
                      <div className="flex flex-col justify-between">
                         <p className="text-gray-500 mb-2 text-sm my-2"> 
                           <span className="text-green-600 text-xl font-bold">
                             {product?.price || 0} EGP
                           </span> per unit
                         </p>
                    
                      {/* Quantity Controls - FIXED: Individual loading states */}
                      <div className="flex items-center gap-3 bg-gray-100 w-fit py-1 px-2 rounded-lg">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            if (product?.product?._id && product?.count > 1) {
                              handleUpdate(product?.product?._id, product?.count - 1)
                            }
                          }}
                          disabled={isUpdatingThisItem || isRemovingThisItem || product?.count <= 1}
                        >
                          {isUpdatingThisItem ? '...' : '-'}
                        </Button>
                        
                        <span className="font-medium min-w-6 text-center">
                          {product?.count}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-600 text-white hover:bg-green-700 hover:text-white cursor-pointer"
                          onClick={() => {
                            if (product?.product?._id) {
                              handleUpdate(product?.product?._id, product?.count + 1)
                            }
                          }}
                          disabled={isUpdatingThisItem || isRemovingThisItem}
                        >
                          {isUpdatingThisItem ? '...' : '+'}
                        </Button>
                      </div>
                      </div>
                      <div className="flex justify-between sm:flex-col gap-2 w-full sm:w-fit sm:ms-auto">
                          {/* Price Total */}
                          <div className="text-left mt-2">
                            <span className="text-md text-gray-500">Total</span>
                            <p className="font-bold text-lg">
                              {((product?.price || 0) * (product?.count || 0))} EGP
                            </p>
                          </div>
                          {/* Remove Button - FIXED: Individual loading state */}
                          <Button
                            size="sm"
                            onClick={() => product?.product?._id && handleRemove(product?.product?._id)}
                            disabled={isRemovingThisItem || isUpdatingThisItem}
                            className="bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 mt-auto sm:w-full cursor-pointer"
                          >
                            {isRemovingThisItem ? 'Removing...' : 'Remove'}
                          </Button>
                      </div>
                    </div>
                   </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Clear Cart Button */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {empty()}}
              disabled={emptyLoading || updatingItemId !== null || removingItemId !== null}
              className="bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 cursor-pointer"
            >
              {emptyLoading ? 'Clearing...' : 'Clear Cart'}
            </Button>
          </div>
        </div>

        {/* Right Column - Order Summary + Info Section */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="w-full rounded-lg bg-white overflow-hidden shadow-md">
            <div className="bg-green-600 p-6">
              <span className="text-2xl text-white font-bold">Order summary</span>
              <p className="text-white text-md mt-1">
                {cartData?.numOfCartItems} {cartData?.numOfCartItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <div className="px-6 pt-2 pb-6">
              {/* Subtotal */}
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{totalCartPrice.toFixed(2)} EGP</span>
              </div>
              
              {/* Shipping */}
              <div className="flex justify-between py-3 border-b">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">Shipping</span>
                  {totalCartPrice >= 500 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>Free shipping on orders over 500 EGP</span>
                    </div>
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
              
              {/* Total */}
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    {totalCartPrice >= 500 ? (
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
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">
                        Add {(500 - totalCartPrice).toFixed(2)} EGP more for free shipping
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {(totalCartPrice + (totalCartPrice >= 500 ? 0 : 60)).toFixed(2)} EGP
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Progress bar for free shipping */}
              {totalCartPrice < 500 && (
                <div className="mt-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Free shipping at 500 EGP</span>
                    <span>{totalCartPrice.toFixed(2)} / 500 EGP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((totalCartPrice / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Checkout Button */}
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer mt-2" 
                size="lg"
                disabled={updatingItemId !== null || removingItemId !== null}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Proceed to Checkout
                </div>
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Shopping Benefits</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-6">
                Secure & Convenient Shopping
              </h3>
              
              <div className="grid md:grid-cols-1 gap-6">
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

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Secure Shopping</h4>
                      <p className="text-gray-300 text-sm">
                        Your payments are protected with 256-bit SSL encryption.
                      </p>
                    </div>
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