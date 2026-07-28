import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/excel-auth";
import { setSessionCookie } from "@/lib/auth/session";
import { defaultRouteForRole } from "@/config/routes.config";
import type { LoginType } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const loginType = String(body?.loginType ?? "Employee") as LoginType;
    const identifier = String(body?.identifier ?? "").trim();
    const password = String(body?.password ?? "");

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 },
      );
    }

    const user = await authenticate({
      loginType,
      identifier,
      password,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username/code or password" },
        { status: 401 },
      );
    }

    await setSessionCookie(user);

    return NextResponse.json({
      message: "Login successful",
      redirectTo: defaultRouteForRole(user.role, user.isManager),
      user,
    });
  } catch (error) {
    console.error("Login service error:", error);

    return NextResponse.json(
      { message: "Login service error" },
      { status: 500 },
    );
  }
}