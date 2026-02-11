import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const verified = cookieStore.get("reset_verified")?.value;
    const email = cookieStore.get("reset_email")?.value;

    if (!verified || verified !== "true" || !email) {
      return NextResponse.json(
        { error: "Please verify your reset code first", status: 403 },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { newPassword, rePassword } = body;

    if (!newPassword || !rePassword) {
      return NextResponse.json(
        { error: "All password fields are required", status: 400 },
        { status: 400 }
      );
    }

    if (newPassword !== rePassword) {
      return NextResponse.json(
        { error: "Passwords do not match", status: 400 },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetPassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload.message || "Failed to reset password", status: response.status },
        { status: response.status }
      );
    }

    const clearResponse = NextResponse.json({
      ...payload,
      message: "Password reset successfully"
    });
    
    clearResponse.cookies.delete("reset_verified");
    clearResponse.cookies.delete("reset_email");

    return clearResponse;

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}