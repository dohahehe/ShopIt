import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, phone } = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/updateMe/`, {
      method: "PUT",
      headers: {
        "token": token.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || "",
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload.message || "Failed to update profile" },
        { status: response.status }
      );
    }

    // Return the updated user data
    return NextResponse.json({
      ...payload,
      user: {
        name,
        email,
        phone,
        ...payload.user,
        ...payload.data?.user,
      }
    });

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}