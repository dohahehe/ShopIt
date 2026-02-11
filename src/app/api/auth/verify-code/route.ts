import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resetCode } = body;

    if (!resetCode) {
      return NextResponse.json(
        { error: "Reset code is required", status: 400 },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyResetCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetCode }), 
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload.message || "Invalid or expired reset code", status: response.status },
        { status: response.status }
      );
    }

    const response_with_cookie = NextResponse.json({
      ...payload,
      verified: true,
      message: "Code verified successfully"
    });
    
    response_with_cookie.cookies.set({
      name: "reset_verified",
      value: "true",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 10,
      sameSite: "strict",
    });
    
    response_with_cookie.cookies.set({
      name: "reset_email",
      value: body.email || "", 
      httpOnly: true,
      path: "/",
      maxAge: 60 * 10,
      sameSite: "strict",
    });

    return response_with_cookie;

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}