import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest){
    try {
        const token = await getToken({req});
        
        if(!token){
            return NextResponse.json({error: 'unauthorized', status: 401})
        }

        const body = await req.json();
        const { productId, count } = body;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: {
                token: token.token,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ count })
        });

        const payload = await response.json();
        return NextResponse.json(payload);
        
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json({error: 'Internal server error', status: 500});
    }
}