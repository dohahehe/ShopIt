'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import addReview from '@/services/reviews/addReview'

const reviewSchema = z.object({
  review: z.string().min(5, 'Review must be at least 5 characters').max(500, 'Review must be less than 500 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
})

type ReviewForm = z.infer<typeof reviewSchema>

interface AddReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  onSuccess: () => void
}

export default function AddReviewModal({ isOpen, onClose, productId, onSuccess }: AddReviewModalProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  const queryClient = useQueryClient()

  const form = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      review: '',
      rating: 0,
    },
  })

  const rating = form.watch('rating')

  const mutation = useMutation({
    mutationFn: (data: ReviewForm) => {
        console.log("Submitting review:", data); // Debug log
        return addReview(productId, data.review, Number(data.rating)); // Ensure number
    },
    onSuccess: () => {
        toast.success('Review added successfully!')
        queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
        queryClient.invalidateQueries({ queryKey: ['product', productId] })
        form.reset()
        onSuccess()
        onClose()
    },
    onError: (error: Error) => {
        console.error("Review error:", error);
        toast.error(error.message || 'Failed to add review')
    },
 })

  const onSubmit = (data: ReviewForm) => {
    mutation.mutate(data)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="bg-green-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Write a Review</h3>
                  <p className="text-green-100 text-sm mt-1">Share your experience with this product</p>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Rating Stars */}
              <Field>
                <FieldLabel className="text-gray-900 font-medium">Rating</FieldLabel>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => form.setValue('rating', star, { shouldValidate: true })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } transition-colors duration-150`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
                  </span>
                </div>
                {form.formState.errors.rating && (
                  <p className="text-sm text-red-600 mt-1">Please select a rating</p>
                )}
              </Field>

              {/* Review Text */}
              <Field>
                <FieldLabel htmlFor="review" className="text-gray-900 font-medium">
                  Your Review
                </FieldLabel>
                <div className="relative">
                  <textarea
                    id="review"
                    {...form.register('review')}
                    rows={5}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    className="w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none resize-none"
                    disabled={mutation.isPending}
                  />
                </div>
                {form.formState.errors.review && (
                  <FieldError errors={[form.formState.errors.review]} />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {form.watch('review').length}/500 characters
                </p>
              </Field>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.formState.isValid}
                  className="w-full sm:flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={mutation.isPending}
                  className="w-full sm:flex-1 h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}