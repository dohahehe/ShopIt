import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({ req });

    if (!token) {
        return NextResponse.json({ error: 'unauthorized', status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: {
            token: token.token,
            'content-type': 'application/json'
        },
    });

    const payload = await response.json();
    return NextResponse.json(payload);
}