import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="bg-green-600 bg-clip-text text-transparent leading-none">
            <span className='text-2xl sm:text-3xl font-bold '>404</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like this page went on an adventure and forgot to come back!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base cursor-pointer">
              Go Home
            </Button>
          </Link>
          
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-gray-300 hover:border-green-600 hover:text-green-600 px-8 py-3 text-base cursor-pointer">
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 pt-2">Try these pages instead:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Categories
            </Link>
            <Link href="/brands" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Brands
            </Link>
            <Link href="/cart" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
              Cart
            </Link>
          </div>
        </div>

       
      </div>
    </div>
  )
}