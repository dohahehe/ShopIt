async function addToCart(productId: string) {
    const response = await fetch(`/api/products/${productId}`, {
        method: 'POST',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.statusText}`);
    }
    
    return response.json();
}

export default addToCart;