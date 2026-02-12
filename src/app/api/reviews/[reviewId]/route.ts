import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const token = await getToken({ req });
    const { reviewId } = await context.params;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { review, rating } = body;

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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          token: token.token as string,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          review, 
          rating: Number(rating) 
        }),
      }
    );

    const text = await response.text();
    
    if (!text) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Review updated successfully",
        });
      }
      return NextResponse.json(
        { error: "Failed to update review" },
        { status: response.status }
      );
    }

    try {
      const payload = JSON.parse(text);
      if (!response.ok) {
        return NextResponse.json(
          { error: payload.message || "Failed to update review" },
          { status: response.status }
        );
      }
      return NextResponse.json(payload);
    } catch (e) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Review updated successfully",
        });
      }
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const token = await getToken({ req });
    const { reviewId } = await context.params;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          token: token.token as string,
          "Content-Type": "application/json",
        },
      }
    );

    const text = await response.text();
    
    if (!text) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Review deleted successfully",
        });
      }
      return NextResponse.json(
        { error: "Failed to delete review" },
        { status: response.status }
      );
    }

    try {
      const payload = JSON.parse(text);
      if (!response.ok) {
        return NextResponse.json(
          { error: payload.message || "Failed to delete review" },
          { status: response.status }
        );
      }
      return NextResponse.json(payload);
    } catch (e) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Review deleted successfully",
        });
      }
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}