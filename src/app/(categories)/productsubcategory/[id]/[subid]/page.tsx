'use client'

import ErrorComponent from "@/app/_components/Error/Error"
import { ProductCard } from "@/app/_components/ProductCard/ProductCard"
import { Product } from "@/app/types/productInterface"
import Loader from "@/Loader/Loader"
import getProductsByCategory from "@/services/categories/getProductsByCategory"
import getSingleSubcategory from "@/services/categories/getSingleSubcategory"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams } from "next/navigation"

function ProductSubcategory() {
  const params = useParams()
  const id = params.id as string
  const subCatId = params.subid as string
  
  // Fetch products for category
  const { data: productsArray, isLoading: productsLoading, isError:prodIsError, error:prodError } = useQuery({
    queryKey: ['products-by-category', id],
    queryFn: () => getProductsByCategory(id),
    refetchOnMount: 'always',
  })

  // Fetch subcategory details
  const { data: subcategory, isLoading: subLoading, isError:subIsError, error:subError } = useQuery({
    queryKey: ['subcategory', subCatId],
    queryFn: () => getSingleSubcategory(subCatId),
    refetchOnMount: 'always',
  })
  
  // Filter products by subcategory ID
  const filteredProducts = productsArray?.filter((product: Product) => 
    product.subcategory?.some((sub: any) => sub._id === subCatId)
  ) || []

  const isLoading = productsLoading || subLoading

  if (isLoading) return <Loader />

  if (subIsError || prodIsError) return <ErrorComponent message={subError?.message || prodError?.message} showContactButton={false} />

  if (filteredProducts.length === 0) {
  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full mb-3">
              <span className="text-sm font-medium text-green-600">Subcategory</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subcategory?.data?.name || 'Subcategory'}
            </h1>
            <p className="text-gray-600">
              No products found in this subcategory
            </p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="w-32 h-32 mx-auto bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                New Products Coming Soon
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    We're actively adding new {subcategory?.data?.name?.toLowerCase()} products to our collection
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Check back in a few days
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/category/${id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Category
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-full">
                <span className="text-sm font-medium text-green-600">Subcategory</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subcategory?.data?.name || 'Subcategory'}
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Explore our curated selection of {subcategory?.data?.name?.toLowerCase()} products
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-medium">{filteredProducts.length} Products</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="font-medium">
                {filteredProducts.length > 0 
                  ? (filteredProducts.reduce((sum: number, product: Product) => sum + (product.ratingsAverage || 0), 0) / filteredProducts.length).toFixed(1)
                  : '0.0'
                } Avg Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Products Grid Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              All Products
            </h2>
            <p className="text-gray-600 text-sm">
              Showing {filteredProducts.length} products
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
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSubcategory