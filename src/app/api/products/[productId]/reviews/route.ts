import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    console.log("=== ADD REVIEW API CALLED ===");
    
    const token = await getToken({ req });
    const { productId } = await context.params;

    console.log("Product ID:", productId);
    console.log("Token exists:", !!token);

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get raw body first
    const rawBody = await req.text();
    console.log("Raw body:", rawBody);

    if (!rawBody) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = JSON.parse(rawBody);
      console.log("Parsed body:", body);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { review, rating } = body;

    console.log("Review:", review);
    console.log("Rating:", rating);
    console.log("Rating type:", typeof rating);

    if (!review || !rating) {
      return NextResponse.json(
        { error: "Review and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Ensure rating is a number
    const numericRating = Number(rating);

    console.log("Calling external API:", `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
      {
        method: "POST",
        headers: {
          token: token.token as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          review, 
          rating: numericRating 
        }),
      }
    );

    console.log("External API response status:", response.status);

    const text = await response.text();
    console.log("External API response body:", text);

    if (!text) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Review added successfully",
        });
      }
      return NextResponse.json(
        { error: "Failed to add review" },
        { status: response.status }
      );
    }

    try {
      const payload = JSON.parse(text);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: payload.message || "Failed to add review" },
          { status: response.status }
        );
      }

      return NextResponse.json(payload);
    } catch (e) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Review added successfully",
        });
      }
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Add review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}