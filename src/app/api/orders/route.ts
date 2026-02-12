import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function decodeJWT(token: string): any {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }
    
    const payloadBase64 = tokenParts[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {

  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    // console.log("Token received:", token ? "Yes" : "No");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const routeMisrToken = (token as any).routeMisrToken || token.token;
    
    // console.log("RouteMisr token exists:", !!routeMisrToken);

    if (!routeMisrToken) {
      return NextResponse.json(
        { error: "Authentication token missing. Please login again." },
        { status: 401 }
      );
    }

    // DECODE the RouteMisr JWT token to extract user ID
    const decodedToken = decodeJWT(routeMisrToken);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const userId = decodedToken.id;
    
    // console.log("Decoded JWT:", decodedToken);
    // console.log("User ID from decoded token:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in token" },
        { status: 400 }
      );
    }

    
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': routeMisrToken,
        },
        cache: 'no-store'
      }
    );

    
    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorDetails = await response.text();
      }
      
      console.error("External API error:", response.status, errorDetails);
      
      return NextResponse.json(
        {
          error: "Failed to fetch orders",
          details: errorDetails,
          userId: userId 
        },
        { status: response.status }
      );
    }

    const ordersData = await response.json();

    return NextResponse.json(ordersData);

  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Server error",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}