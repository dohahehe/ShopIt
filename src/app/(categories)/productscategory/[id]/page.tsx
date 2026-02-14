'use client'
import ErrorComponent from "@/app/_components/Error/Error";
import { ProductCard } from "@/app/_components/ProductCard/ProductCard";
import { Category, Product } from "@/app/types/productInterface";
import Loader from "@/Loader/Loader";
import getProductsByCategory from "@/services/categories/getProductsByCategory";
import getSingleCategory from "@/services/categories/getSingleCategory";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

function CategoryProductsPage() {
  const params = useParams()
  const id = params.id as string
  
  // Fetch category
  const { data: categoryData, isLoading: categoryLoading, isError:catIsError, error:catError } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getSingleCategory(id),
    refetchOnMount: 'always',
  })

  // Fetch products for category
  const { data: products, isLoading: productsLoading, isError:prodIsError, error:prodError } = useQuery({
    queryKey: ['products-by-category', id],
    queryFn: () => getProductsByCategory(id),
    refetchOnMount: 'always',
  })

  const category = categoryData?.data
  const productsList = products || []

  if (categoryLoading || productsLoading) return <Loader />

  if (catIsError || prodIsError) return <ErrorComponent message={catError?.message || prodError?.message} showContactButton={false} />

  // Calculate average rating
  const averageRating = productsList.length > 0
    ? (productsList.reduce((sum: number, product: Product) => sum + (product.ratingsAverage || 0), 0) / productsList.length).toFixed(1)
    : "0.0"

  // Calculate total sold
  const totalSold = productsList.reduce((sum: number, product: Product) => sum + (product.sold || 0), 0)

  return (
    <div className="w-full">
      {/* Header with Subtle Green Accent */}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">Category</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All {category?.name} Products
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Browse our complete collection of {category?.name.toLowerCase()} products
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{productsList.length} Products</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="font-medium">{averageRating} Avg Rating</span>
            </div>
            
            {totalSold > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{totalSold > 5000 ? '5000+' : totalSold.toLocaleString() } Sold</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Header with back link */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              All Products
            </h2>
            <p className="text-gray-600 text-sm">
              Showing {productsList.length} of {productsList.length} products
            </p>
          </div>
          <Link 
            href={`/category/${id}`}
            className="inline-flex items-center gap-2 text-green-600 text-sm font-medium hover:text-green-700 transition-colors group"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Back to Category
          </Link>
        </div>

        {/* Products Grid */}
        {productsList.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Products Found
              </h2>
              <p className="text-gray-600 mb-8">
                There are no products available in {category?.name?.toLowerCase()} yet.
                Check back soon or explore other categories.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/categories"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Other Categories
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
              {productsList.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {/* Category Info Section */}
            <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">About {category?.name}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  Premium {category?.name} Experience
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Quality Guarantee</h4>
                        <p className="text-gray-300">
                          Every {category?.name?.toLowerCase()} product is carefully curated and quality checked by our experts.
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
                        <p className="text-gray-300">
                          Free shipping on orders over 500 EGP. 1-3 business days delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Secure Shopping</h4>
                        <p className="text-gray-300">
                          Your payments are protected with 256-bit SSL encryption.
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
                        <h4 className="font-semibold text-lg mb-1">Easy Returns</h4>
                        <p className="text-gray-300">
                          30-day return policy. No questions asked returns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryProductsPage;