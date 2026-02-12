export default async function getProducts(keyword?: string) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/products`
  
  if (keyword) {
    url += `?keyword=${encodeURIComponent(keyword)}`
  }
  
  const res = await fetch(url, {
    method: 'GET',
    next: { revalidate: 60 } // ISR
  });
  
  const responseData = await res.json();
  return responseData.data;
}