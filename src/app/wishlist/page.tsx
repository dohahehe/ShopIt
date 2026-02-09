'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Loader from "@/Loader/Loader"
import toast from "react-hot-toast"
import { useState } from "react"
import Error from "../_components/Error/Error"
import getWishlist from "@/services/wishlist/getWishlist"
import removeFromWishlist from "@/services/wishlist/removeFromWishlist"
import addToCart from "@/services/cart/add-to-cart"
import AddToCartBtn from "../_components/AddToCartBtn/AddToCartBtn"

type WishlistItem = {
  _id: string
  title: string
  description: string
  price: number
  imageCover: string
  category: {
    _id: string
    name: string
    slug: string
  }
  quantity: number
  ratingsAverage: number
  ratingsQuantity: number
}

type WishlistResponse = {
  success: boolean
  message: string
  data: WishlistItem[]
  count: number
}

export default function WishList() {
  const queryClient = useQueryClient()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  // Get Wishlist Data
  const { data: wishlistData, isLoading, isError, error } = useQuery<WishlistResponse>({
    queryKey: ['wishlist'],
    queryFn: getWishlist
  })

  // Remove from wishlist mutation
  const { mutate: removeFromWishlistMutate, isPending: removeLoading } = useMutation({
    mutationFn: removeFromWishlist,
    onMutate: (productId) => {
      setRemovingItemId(productId)
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Removed from wishlist!')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      setRemovingItemId(null)
    },
    onError: (error) => {
      toast.error('Failed to remove from wishlist')
      setRemovingItemId(null)
    }
  })

  // Add to cart mutation
  const { mutate: addToCartMutate, isPending: addToCartLoading } = useMutation({
    mutationFn: addToCart,
    onMutate: (productId) => {
      setAddingToCart(productId)
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Added to cart!')
      queryClient.invalidateQueries({ queryKey: ['get-cart'] })
      setAddingToCart(null)
    },
    onError: (error) => {
      toast.error('Failed to add to cart')
      setAddingToCart(null)
    }
  })

  const handleRemove = (productId: string) => {
    removeFromWishlistMutate(productId)
  }

  const handleAddToCart = (productId: string) => {
    addToCartMutate(productId)
  }

  const handleMoveAllToCart = () => {
    if (wishlistData?.data) {
      wishlistData.data.forEach((item) => {
        addToCartMutate(item._id)
      })
    }
  }

  if (isLoading) return <Loader />
  
  if (isError) return <Error message={error.message} showContactButton={false} />
  
  if (!wishlistData || wishlistData?.count === 0) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="w-full bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full">
                  <svg 
                    className="w-4 h-4 text-green-600" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-sm font-medium text-green-600">Wishlist</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600 max-w-2xl">
                Save items you love for later
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
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Add items you love to your wishlist. They'll be saved here for you to access anytime.
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

  const wishlistItems = wishlistData?.data || []
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)

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
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-sm font-medium text-green-600">Wishlist</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600 max-w-2xl">
              Your saved items ({wishlistData?.count} {wishlistData?.count === 1 ? 'item' : 'items'})
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{wishlistData?.count} Items</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{totalValue.toFixed(2)} EGP Total Value</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wishlist Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {wishlistItems?.map((item) => {
              const isAddingToCart = addingToCart === item._id
              const isRemovingThisItem = removingItemId === item._id
              
              return (
                <div key={item._id} className="relative w-full group rounded-lg border-0 bg-white shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex flex-col items-center gap-2">
                    {/* Product Image */}
                    <div className="w-32 h-full rounded flex items-center justify-center overflow-hidden">
                      {item.imageCover ? (
                        <img 
                          src={item.imageCover} 
                          alt={item.title || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-3xl">📦</span>
                      )}
                    </div>
                    {item.quantity > 0 && 
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
                        <span>In Stock</span>
                      </p> 
                    }
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 title={item.title} className="font-semibold text-lg group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {item.category?.name && (
                        <Badge className="bg-green-50 text-green-700 mt-2">
                          {item.category.name}
                        </Badge>
                      )}
                      
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Ratings */}
                      {item.ratingsAverage > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(item.ratingsAverage) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({item.ratingsQuantity} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-gray-500 text-sm mb-2">Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {item.price} EGP
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-auto">
                        <AddToCartBtn productId={item._id} />
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemove(item._id)}
                          disabled={isRemovingThisItem || isAddingToCart}
                          className="bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 cursor-pointer py-4"
                        >
                          {isRemovingThisItem ? 'Removing...' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t flex flex-wrap gap-4">
            <Button
              onClick={handleMoveAllToCart}
              disabled={addToCartLoading || wishlistItems.length === 0}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              {addToCartLoading ? 'Adding All...' : 'Add All to Cart'}
            </Button>
            
          </div>
        </div>

        {/* Summary + Info Section */}
        <div className="space-y-6">
          {/* Wishlist Summary */}
          <div className="w-full rounded-lg bg-white overflow-hidden shadow-md">
            <div className="bg-green-600 p-6">
              <span className="text-2xl text-white font-bold">Wishlist Summary</span>
              <p className="text-white text-md mt-1">
                {wishlistData?.count} {wishlistData?.count === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
            
            <div className="px-6 pt-2 pb-6">
              {/* Total Value */}
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Total Value</span>
                <span className="font-medium text-lg">{totalValue.toFixed(2)} EGP</span>
              </div>
              
              {/* Items Count */}
              <div className="flex justify-between py-3">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">Items</span>
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
                    <span>All prices are current</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium">{wishlistData?.count} items</span>
                </div>
              </div>
              
              {/* Action Section */}
              <div className="py-4">
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 cursor-pointer" 
                    size="lg"
                    onClick={handleMoveAllToCart}
                    disabled={addToCartLoading || wishlistItems.length === 0}
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
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {addToCartLoading ? 'Adding...' : 'Add All to Cart'}
                    </div>
                  </Button>
                  
                  <Link href="/products">
                    <Button 
                      variant="outline"
                      className="w-full cursor-pointer"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Wishlist Benefits</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-6">
                Why Save to Wishlist?
              </h3>
              
              <div className="grid md:grid-cols-1 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Never Forget</h4>
                      <p className="text-gray-300 text-sm">
                        Save items you love and come back to them later.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Price Tracking</h4>
                      <p className="text-gray-300 text-sm">
                        Keep track of items and their current prices.
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
                      <h4 className="font-semibold text-lg mb-1">Quick Checkout</h4>
                      <p className="text-gray-300 text-sm">
                        Add multiple items to cart with one click.
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