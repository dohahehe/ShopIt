'use client'

import { useMemo, useState } from 'react'
import AddToCartBtn from "@/app/_components/AddToCartBtn/AddToCartBtn";
import AddToFavorites from "@/app/_components/AddToFavorites/AddToFavorites";
import ErrorComponent from "@/app/_components/Error/Error";
import ProductsSlider from "@/app/_components/ProductsSlider/ProductsSlider";
import AddReviewModal from "@/app/_components/Review/AddReviewModal";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Loader from "@/Loader/Loader";
import getProductDetails from "@/services/products/getProductDetails";
import getReviewsForProduct from "@/services/reviews/getReviewsForProduct";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from 'react-hot-toast';
import deleteReview from '@/services/reviews/deleteReview';
import EditReviewModal from './EditReviewModal';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/app/types/authInterface';

export default function ProductDetails() {
  const { data: session } = useSession()
  // console.log("Session object:", session);
  // console.log("Session token:", (session as any)?.token);
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<{
    id: string;
    review: string;
    rating: number;
  } | null>(null);
  
  // Fetch ProductDetails
  const { data: singleProduct, isLoading: productLoading, isError, error, refetch: refetchProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetails(id),
    refetchOnMount: 'always',
  })

  // Fetch Reviews
  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsForProduct(id),
    enabled: !!singleProduct, 
  })

  // Delete Review Mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      toast.success('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      refetchReviews();
      refetchProduct();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });

  const handleDeleteReview = (reviewId: string) => {
      deleteMutation.mutate(reviewId);
  };

  // const decodeJWT = (token: string): any => {
  //   try {
  //     const tokenParts = token.split('.');
  //     if (tokenParts.length !== 3) {
  //       return null;
  //     }
      
  //     const payloadBase64 = tokenParts[1];
  //     const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
  //     return JSON.parse(payloadJson);
  //   } catch (error) {
  //     console.error("Error decoding JWT:", error);
  //     return null;
  //   }
  // };

  const userId = useMemo(() => {
    const token = (session as any)?.token;
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [session]);

  if(productLoading) return <Loader />
  if(isError) return <ErrorComponent message={error.message} showContactButton={false} />
  
  return (
    <div className="min-h-screen mx-auto">
      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        productId={id}
        onSuccess={() => {
          refetchProduct()
          refetchReviews()
        }}
      />

      {/* Edit Review Modal */}
      {editingReview && (
        <EditReviewModal
          isOpen={!!editingReview}
          onClose={() => setEditingReview(null)}
          reviewId={editingReview.id}
          currentReview={editingReview.review}
          currentRating={editingReview.rating}
          productId={id}
          onSuccess={() => {
            refetchReviews();
            refetchProduct();
            setEditingReview(null);
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="overflow-hidden">
              <ProductsSlider images={singleProduct?.images} />
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="px-3 py-1.5 bg-linear-to-br from-yellow-100 to-amber-100 border-yellow-200">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-yellow-800 font-medium">
                      {singleProduct?.ratingsAverage} ({singleProduct?.ratingsQuantity} reviews)
                    </span>
                  </div>
                </Badge>

                <div className="flex items-center gap-3">
                  {singleProduct?.priceAfterDiscount !== undefined && (
                    <Badge className="px-3 py-1.5 bg-linear-to-br from-green-100 to-emerald-100 border-green-200">
                      <span className="text-green-800 font-medium">
                        {Math.round(((singleProduct.price - singleProduct.priceAfterDiscount) / singleProduct.price) * 100)}% OFF
                      </span>
                    </Badge>
                  )}
                  {singleProduct?.quantity !== undefined && singleProduct.quantity < 100 && (
                    <Badge className="px-3 py-1.5 bg-linear-to-br from-red-100 to-rose-100 border-red-200">
                      <span className="text-red-800 font-medium">Selling Fast</span>
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {singleProduct?.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Brand:</span>
                <span className="font-medium text-gray-900">{singleProduct?.brand?.name}</span>
                <span className="mx-2">•</span>
                <span>Category:</span>
                <Link 
                  href={`/category/${singleProduct?.category?._id}`}
                  className="font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  {singleProduct?.category?.name}
                </Link>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Product Description</h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {singleProduct?.description?.length 
                  ? singleProduct.description
                  : 'No detailed description available for this product.'}
              </p>
            </div>

            {/* Pricing & Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Price</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900">
                        EGP {singleProduct?.priceAfterDiscount || singleProduct?.price}
                      </span>
                      {singleProduct?.priceAfterDiscount && (
                        <span className="text-lg text-gray-400 line-through">
                          EGP {singleProduct.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">In Stock</span>
                    </div>
                    {singleProduct?.quantity !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        Only {singleProduct.quantity} items left
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <AddToCartBtn productId={singleProduct?._id} />
                    <AddToFavorites productId={singleProduct?._id} />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">
                        Free delivery on orders over <span className="font-medium">500 EGP</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated delivery: 1-3 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-linear-to-br from-yellow-100 to-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
                </div>
                
                {session ? (
                  <Button 
                    onClick={() => setIsAddReviewModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Write a Review
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer">
                      Sign in to Review
                    </Button>
                  </Link>
                )}
              </div>

              {/* Reviews List */}
              {reviews?.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => {
                    const isOwner = userId === review.user?._id;
                    const isAdmin = (session?.user as any)?.role === 'admin';
                    const canModify = isOwner || isAdmin;
                    
                    return (
                      <div key={review._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                {review.updatedAt !== review.createdAt && (
                                  <span className="text-xs text-gray-400 ml-2">(edited)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            
                            {canModify && (
                              <div className="flex items-center gap-1">
                                {isOwner && (
                                  <button
                                    onClick={() => setEditingReview({
                                      id: review._id,
                                      review: review.review,
                                      rating: review.rating
                                    })}
                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                    title="Edit review"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  disabled={deleteMutation.isPending}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                  title="Delete review"
                                >
                                  {deleteMutation.isPending ? (
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
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 ml-11">{review.review}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                  <p className="text-sm text-gray-600 mb-4">Be the first to share your experience with this product.</p>
                  {session ? (
                    <Button 
                      onClick={() => setIsAddReviewModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer">
                        Sign in to Review
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Premium Experience Section */}
            <div className="space-y-6">
              <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Premium Experience</span>
                </div>
                
                <h3 className="text-xl font-bold mb-4">
                  Why Shop With Us
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Fast Shipping</h4>
                      <p className="text-gray-300 text-xs">
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
                      <h4 className="font-semibold text-sm mb-1">Secure Payment</h4>
                      <p className="text-gray-300 text-xs">
                        Your payments are protected with 256-bit SSL encryption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Quality Guarantee</h4>
                      <p className="text-gray-300 text-xs">
                        Every product is carefully curated and quality checked by our experts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Easy Returns</h4>
                      <p className="text-gray-300 text-xs">
                        30-day return policy. No questions asked returns.
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