async function updateCartItem({ productId, count }: { productId: string, count: number }) {
    const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, count }),
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update cart: ${response.statusText}`);
    }
    
    return response.json();
}

export default updateCartItem;