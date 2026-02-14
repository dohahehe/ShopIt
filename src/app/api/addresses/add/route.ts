import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    
    const token = await getToken({ req });

    if (!token) {
      console.log("No token found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // console.log("Token found for user:", token.email);

    const rawBody = await req.text();
    
    if (!rawBody) {
      console.log("Empty request body");
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, details, phone, city } = body;

    if (!name || !details || !phone || !city) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
      method: "POST",
      headers: {
        "token": token.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        details,
        phone,
        city
      }),
    });


    const text = await response.text();

    if (!text) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Address added successfully",
          data: { _id: Date.now().toString(), name, details, phone, city }
        });
      }
      return NextResponse.json(
        { error: "Failed to add address" },
        { status: response.status }
      );
    }

    try {
      const payload = JSON.parse(text);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: payload.message || payload.errors?.message || "Failed to add address" },
          { status: response.status }
        );
      }

      return NextResponse.json(payload);
    } catch (e) {
      if (response.ok) {
        return NextResponse.json({
          status: "success",
          message: "Address added successfully",
          data: { _id: Date.now().toString(), name, details, phone, city }
        });
      }
      
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}