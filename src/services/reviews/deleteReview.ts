export default async function deleteReview(reviewId: string): Promise<{ status: string; message: string }> {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || data.message || 'Failed to delete review');
  return data;
}