import { AddReviewResponse } from "@/app/types/reviews";

export default async function addReview(
  productId: string,
  review: string,
  rating: number
): Promise<AddReviewResponse> {
  console.log("addReview called with:", { productId, review, rating });
  
  const response = await fetch(`/api/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      review, 
      rating: Number(rating)
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to add review');
  }

  return data;
}