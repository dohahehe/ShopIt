'use client'

import addToWishlist from "@/services/wishlist/addToWishlist"
import getWishlist from "@/services/wishlist/getWishlist";
import removeFromWishlist from "@/services/wishlist/removeFromWishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function AddToFavorites({productId}: {productId: string}) {
    const queryClient = useQueryClient()
    const [isWishlisted, setIsWishlisted] = useState(false)

    // Get wishlist
    const { data: wishlistData, refetch } = useQuery({
        queryKey: ['wishlist'],
        queryFn: getWishlist,
    });

    useEffect(() => {
        console.log('Wishlist data updated:', wishlistData);
        
        if (wishlistData?.data) {
            const wishlistProducts = wishlistData.data;
            
            // Check if any product in the wishlist has the matching _id
            const inWishlist = wishlistProducts.some((product: any) => {
                return product._id === productId;
            });
            
            setIsWishlisted(inWishlist);
        } else {
            setIsWishlisted(false);
        }
    }, [wishlistData, productId]);

    // Add to wishlist mutation
    const { mutate: addToWishlistMutate, isPending: adding } = useMutation({
        mutationFn: addToWishlist,
        onMutate: () => {
            setIsWishlisted(true);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Added to wishlist!');
            queryClient.invalidateQueries({queryKey:['wishlist']})
            queryClient.invalidateQueries({queryKey:['get-products']})
        },
        onError: (error) => {
            toast.error('Failed to add to wishlist');
            setIsWishlisted(false);
        }
    });

    // Remove from wishlist mutation
    const { mutate: removeFromWishlistMutate, isPending: removing } = useMutation({
        mutationFn: removeFromWishlist,
        onMutate: () => {
            setIsWishlisted(false);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Removed from wishlist!');
            queryClient.invalidateQueries({queryKey:['wishlist']})
            queryClient.invalidateQueries({queryKey:['get-products']})
        },
        onError: (error) => {
            toast.error('Failed to remove from wishlist');
            setIsWishlisted(true);
        }
    });

    const handleWishlistToggle = () => {
        if (isWishlisted) {
            removeFromWishlistMutate(productId);
        } else {
            addToWishlistMutate(productId);
        }
    };

    const isLoading = adding || removing;

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading} 
      className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <svg 
          className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${
            isWishlisted 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-400 group-hover:text-red-400'
          }`}
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isWishlisted ? "0" : "2"}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
      
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
        {isLoading ? 'Processing...' : (isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist')}
      </span>
    </button>
  )
}

export default AddToFavorites