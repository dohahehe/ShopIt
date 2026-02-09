// AddToCartBtn.tsx
'use client'
import { Button } from "@/components/ui/button"
import addToCart from "@/services/cart/add-to-cart"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useState } from "react"

function AddToCartBtn({productId}:{productId: string}) {
    const queryClient = useQueryClient()
    const [isAdding, setIsAdding] = useState(false)
    
    const { mutate:addProductToCart } = useMutation({
        mutationFn: addToCart,
        onSuccess: (data) => {
            toast.success(data?.message || 'Added to cart!')
            queryClient.invalidateQueries({queryKey:['get-cart']})
            setIsAdding(false)
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Login first!')
            setIsAdding(false)
        }
    })

    const handleAddToCart = () => {
        setIsAdding(true)
        addProductToCart(productId)
    }
    
    return (
        <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="relative flex items-center text-white bg-green-600 hover:bg-green-50 hover:text-green-600 cursor-pointer focus:ring-4 focus:ring-brand-medium shadow-xs font-medium rounded-lg text-md px-3 py-2 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isAdding ? (
                // Loading spinner
                <svg 
                    className="w-6 h-6 animate-spin" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                // Plus icon
                <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            )}
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {isAdding ? 'Adding...' : 'Add To Cart'}
            </span>
        </Button>
    )
}

export default AddToCartBtn