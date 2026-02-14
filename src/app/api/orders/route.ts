import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/app/types/authInterface";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // The token from your external API is stored in token.token
    const apiToken = token.token;
    
    if (!apiToken) {
      return NextResponse.json(
        { error: "Authentication token missing. Please login again." },
        { status: 401 }
      );
    }

    // Decode the token to get user ID
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwtDecode<DecodedToken>(apiToken);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
    
    // console.log("Decoded JWT:", decodedToken);

    const userId = decodedToken.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in token" },
        { status: 400 }
      );
    }

    // Fetch orders using the user ID from the decoded token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': apiToken,
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