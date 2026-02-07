import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ productId: string }> } 
){
    const token = await getToken({req});
    const { productId } = await context.params; 

    if(!token){
        return NextResponse.json({error: 'unauthorized', status: 401})
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
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