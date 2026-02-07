async function deleteCartItem(productId: string) {
    const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to delete cart item: ${response.statusText}`);
    }
    
    return response.json();
}

export default deleteCartItem;

// server action : when modifying data like post, put, delete
// cant use server action with get
