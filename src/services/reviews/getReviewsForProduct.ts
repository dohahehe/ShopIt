async function getReviewsForProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/reviews`);
  const responseData = await res.json();
  return responseData.data;
}

export default getReviewsForProduct