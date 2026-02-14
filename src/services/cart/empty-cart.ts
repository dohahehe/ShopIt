async function emptyCart() {
    const response = await fetch('/api/cart/empty', {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to empty cart: ${response.statusText}`);
    }
    
    return response.json();
}

export default emptyCart;


