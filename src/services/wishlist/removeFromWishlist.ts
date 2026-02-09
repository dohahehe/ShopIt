async function removeFromWishlist(productId: string) {
    const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to remove from wishlist: ${response.statusText}`);
    }
    
    return response.json();
}

export default removeFromWishlist;