'use client'
import getProducts from "@/services/products/getProducts";
import { ProductCard } from "../_components/ProductCard/ProductCard";
import { Product } from "../types/productInterface";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/Loader/Loader";
import ErrorComponent from "../_components/Error/Error";
import { useSearchParams } from "next/navigation";

export default function Products() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const {data: allProducts, isLoading, isError, error} = useQuery<Product[]>({
    queryKey: ['get-products', keyword], 
    queryFn: () => getProducts(keyword)  
  })

  if(isLoading) return <Loader />

  if (isError) return <ErrorComponent message={error.message} showContactButton={false} />


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
                <span className="text-sm font-medium text-green-600">{keyword ? keyword : 'Featured' } Products</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All {keyword? keyword : ''} Products</h1>
              <p className="text-gray-600 max-w-2xl">
                Explore our curated selection of products
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">{allProducts?.length} Products</span>
              </div>
            </div>
          </div>
        </div>

        {allProducts?.length === 0 && (
          <div className="container mx-auto px-4 py-4 my-auto">
              <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3">
                    <div className="w-24 h-24 mx-auto bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
            
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Products Coming Soon
                    </h2>
              
                  <div className="space-y-4 ">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">
                        We're actively adding new products to our collection
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
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Products */}
        <div className="mx-auto container px-4 py-6 gap-5 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {
            allProducts?.map((product) => <ProductCard key={product._id} product={product}/>)
          }
        </div>   
      <div/> 
      </div>

    );
}
