import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const addressId = id;

    // console.log("Deleting address:", addressId);
    // console.log("User:", token.email);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        "token": token.token as string,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    
    if (!text) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Address deleted successfully"
        });
      }
      return NextResponse.json(
        { error: "Failed to delete address" },
        { status: response.status }
      );
    }

    try {
      const payload = JSON.parse(text);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: payload.message || "Failed to delete address" },
          { status: response.status }
        );
      }

      return NextResponse.json(payload);
    } catch (e) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Address deleted successfully"
        });
      }
      
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}