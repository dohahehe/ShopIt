async function getWishlist() {
    const response = await fetch('/api/wishlist');
    
    if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
    }
    
    return response.json();
}

export default getWishlist;