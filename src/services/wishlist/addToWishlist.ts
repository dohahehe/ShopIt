async function addToWishlist(productId: string) {
    const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'POST',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add to wishlist: ${response.statusText}`);
    }
    
    return response.json();
}

export default addToWishlist;