import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please login again", status: 401 },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { currentPassword, password, rePassword } = body;

    if (!currentPassword || !password || !rePassword) {
      return NextResponse.json(
        { error: "All password fields are required", status: 400 },
        { status: 400 }
      );
    }

    if (password !== rePassword) {
      return NextResponse.json(
        { error: "New passwords do not match", status: 400 },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters", status: 400 },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/changeMyPassword`, {
      method: "PUT",
      headers: {
        "token": token.token as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        password,
        rePassword,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload.message || "Failed to change password", status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ...payload,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}