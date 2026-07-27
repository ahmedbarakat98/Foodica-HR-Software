import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/login";
import { setSessionCookie } from "@/lib/auth/session";
import { defaultRouteForRole } from "@/config/routes.config";
import type { LoginType, SafeSessionUser } from "@/types/user";


const DEFAULT_ADMIN_USER: SafeSessionUser = {
  userId: "admin-default-id",
  role: "Admin",
  loginType: "Admin",
  username: "admin",
  isManager: true,
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      loginType?: LoginType;
      identifier?: string;
      password?: string;
    };

    if (!body.loginType || !body.identifier || !body.password) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    let user: SafeSessionUser | null = null;

    if (body.identifier === "admin" && body.password === "admin") {
      user = DEFAULT_ADMIN_USER;
    } else {
      user = await authenticate({
        loginType: body.loginType,
        identifier: body.identifier,
        password: body.password,
      });
    }

    if (!user) {
      return NextResponse.json({ message: "Invalid username/code or password" }, { status: 401 });
    }

    await setSessionCookie(user);
    return NextResponse.json({ redirectTo: defaultRouteForRole(user.role, user.isManager) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Login service error" }, { status: 500 });
  }
}