'use client'

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Loader from "@/Loader/Loader"
import { useState } from "react"
import ErrorComponent from "@/app/_components/Error/Error"
import { Order, OrdersResponse } from "@/app/types/orders"


export default function Orders() {  
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Get Orders Data
  const { data: ordersData, isLoading, isError, error } = useQuery<OrdersResponse>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      return response.json()
    }
  })
  
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.data || []
  const totalOrders = orders.length

  if (isLoading) return <Loader />
  
  if (isError) return <ErrorComponent message={error.message} showContactButton={false} />
  
  

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full min-h-full">
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
                  <span className="text-sm font-medium text-green-600">My Orders</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600 max-w-2xl">
                Track and manage your purchases
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No orders yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Your order history will appear here once you make a purchase.
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

  const totalSpent = orders.reduce((sum, order) => sum + order.totalOrderPrice, 0)

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
                <span className="text-sm font-medium text-green-600">My Orders</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
            <p className="text-gray-600 max-w-2xl">
              Track and manage your purchases ({totalOrders} {totalOrders === 1 ? 'order' : 'orders'})
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{totalOrders} Total Orders</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                Total Spent: {totalSpent.toFixed(2)} EGP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
         {orders.map((order) => {
            const isSelected = selectedOrder === order._id
            const totalItems = order.cartItems?.reduce((sum, item) => sum + item.count, 0) || 0

            return (
              <div key={order._id} className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden shadow-sm md:shadow-md mb-4 md:mb-6">
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b">
                  <div className="flex flex-col gap-3 md:gap-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">
                            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={`text-xs md:text-sm ${
                              order.isPaid 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-yellow-50 text-yellow-700'
                            }`}>
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </Badge>
                            <Badge className={`text-xs md:text-sm ${
                              order.isDelivered 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-gray-50 text-gray-700'
                            }`}>
                              {order.isDelivered ? 'Delivered' : 'Processing'}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Order details - mobile stacked, desktop in row */}
                        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{order.totalOrderPrice.toFixed(2)} EGP</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{order.paymentMethodType === 'card' ? 'Card' : 'Cash'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full md:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(isSelected ? null : order._id)}
                          className="w-full md:w-auto cursor-pointer hover:bg-green-50 hover:text-green-700 hover:border-green-200 text-xs md:text-sm"
                        >
                          {isSelected ? 'Hide Details' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details  */}
                {isSelected && (
                  <div className="p-4 md:p-6 border-t bg-gray-50">
                    {/* Shipping Address */}
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Shipping Address
                      </h4>
                      <div className="bg-white p-3 md:p-4 rounded-lg border text-sm md:text-base">
                        <p className="text-gray-800">{order.shippingAddress?.details || 'N/A'}</p>
                        <p className="text-gray-600">{order.shippingAddress?.city || 'N/A'}</p>
                        <p className="text-gray-600">{order.shippingAddress?.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Items ({totalItems})
                      </h4>
                      <div className="space-y-2 md:space-y-3">
                        {order.cartItems?.map((item) => (
                          <div key={item._id} className="flex items-start md:items-center gap-3 bg-white p-3 md:p-4 rounded-lg border">
                            {/* Product Image */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden shrink-0 bg-gray-100">
                              {item.product?.imageCover ? (
                                <img 
                                  src={item.product.imageCover} 
                                  alt={item.product.title || 'Product'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 text-sm md:text-base mb-1 line-clamp-2">
                                {item.product?.title || 'Unknown Product'}
                              </h5>
                              {item.product?.category?.name && (
                                <Badge className="hidden sm:visible bg-green-50 text-green-700 text-xs">
                                  {item.product.category.name}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Quantity and Price */}
                            <div className="text-right min-w-20 md:min-w-25">
                              <div className="flex flex-col md:flex-row md:items-center md:gap-3 mb-1">
                                <span className="text-xs md:text-sm text-gray-600">Qty: {item.count}</span>
                                <span className="text-xs md:text-sm font-medium">× {item.price.toFixed(2)} EGP</span>
                              </div>
                              <div className="font-bold text-sm md:text-base">
                                {(item.price * item.count).toFixed(2)} EGP
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Order Summary
                      </h4>
                      <div className="bg-white rounded-lg border p-3 md:p-4">
                        <div className="space-y-2 text-sm md:text-base">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items Total</span>
                            <span className="font-medium">
                              {order.cartItems?.reduce((sum, item) => sum + (item.price * item.count), 0).toFixed(2)} EGP
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">{order.shippingPrice.toFixed(2)} EGP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">{order.taxPrice.toFixed(2)} EGP</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-900">Total Amount</span>
                              <span className="font-bold text-base md:text-lg text-gray-900">
                                {order.totalOrderPrice.toFixed(2)} EGP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Order Support</span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold mb-6">
              Need Help With Your Order?
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
  )
}