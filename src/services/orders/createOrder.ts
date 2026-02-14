import { CreateCashOrderParams, CreateCheckoutSessionParams } from "@/app/types/orders";

// cash order
export async function createCashOrder({ 
    cartId, 
    shippingAddress 
}: CreateCashOrderParams) {
    try {
        const response = await fetch(`/api/orders/${cartId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shippingAddress })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create cash order');
        }

        return data;
    } catch (error) {
        console.error('Create cash order error:', error);
        throw error;
    }
}

// online payment
export async function createCheckoutSession({ 
    cartId, 
    shippingAddress, 
    returnUrl 
}: CreateCheckoutSessionParams) {
    try {
        let apiUrl = `/api/orders/checkout-session/${cartId}`;
        
        if (returnUrl) {
            apiUrl += `?url=${encodeURIComponent(returnUrl)}`;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shippingAddress })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create checkout session');
        }

        return data;
    } catch (error) {
        console.error('Create checkout session error:', error);
        throw error;
    }
}