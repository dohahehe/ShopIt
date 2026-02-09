import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Add to wishlist
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ productId: string }> } 
){
    const token = await getToken({req});
    const { productId } = await context.params;

    if(!token){
        return NextResponse.json({error: 'unauthorized', status: 401});
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        method: 'POST',
        headers: {
            token: token.token,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ productId })
    });

    const payload = await response.json();
    return NextResponse.json(payload);
}

// Remove from wishlist
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ productId: string }> } 
){
    const token = await getToken({req});
    const { productId } = await context.params;

    if(!token){
        return NextResponse.json({error: 'unauthorized', status: 401});
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
            token: token.token,
            'content-type': 'application/json'
        },
    });

    const payload = await response.json();
    return NextResponse.json(payload);
}