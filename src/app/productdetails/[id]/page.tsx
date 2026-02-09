'use client'
import AddToCartBtn from "@/app/_components/AddToCartBtn/AddToCartBtn";
import AddToFavorites from "@/app/_components/AddToFavorites/AddToFavorites";
import Error from "@/app/_components/Error/Error";
import ProductsSlider from "@/app/_components/ProductsSlider/ProductsSlider";
import { Badge } from "@/components/ui/badge"
import Loader from "@/Loader/Loader";
import getProductDetails from "@/services/products/getProductDetails";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function ProductDetails() {
  const params = useParams();
  let id = params.id as string;

 
  // Fetch ProductDetails
  const { data: singleProduct, isLoading: productLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetails(id),
    refetchOnMount: 'always',
  })

  if(productLoading) return <Loader />

  if(isError) return <Error message={error.message} showContactButton={false} />
  
  return (
    <div className="min-h-screen mx-auto">
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">

            <div className="overflow-hidden">
              <ProductsSlider images={singleProduct?.images} />
            </div>

            
          </div>

          {/* Product Details*/}
          <div>
            {/* Product Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="px-3 py-1.5 bg-linear-to-br from-yellow-100 to-amber-100 border-yellow-200">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
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
                        {Math.round((singleProduct?.priceAfterDiscount / singleProduct?.price) * 100)}% OFF
                      </span>
                    </Badge>
                  )}
                  {singleProduct?.quantity !== undefined && singleProduct.quantity < 100 && (
                    <Badge className="px-3 py-1.5 bg-linear-to-br from-red-100 to-rose-100 border-red-200">
                      <span className="text-red-800 font-medium">
                        Selling Fast
                      </span>
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
                {/* Price Display */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Price</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900">
                        EGP {singleProduct?.priceAfterDiscount || singleProduct?.price}
                      </span>
                      {singleProduct?.priceAfterDiscount && singleProduct.priceAfterDiscount < singleProduct.price && (
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

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <AddToCartBtn 
                      productId={singleProduct?._id}
                    />
                    
                    <AddToFavorites productId={singleProduct?._id} />
                  </div>

                  
                </div>

                {/* Delivery Info */}
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

            {/* Premium Experience Section */}
            <div className="space-y-6">
              {/* Premium Experience Card */}
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