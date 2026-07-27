import { NextRequest, NextResponse } from "next/server";
import { supportedLocales } from "@/config/app.config";

function hasLocale(pathname: string) {
  return supportedLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // استثناء ملفات API، ملفات Next الداخلية، والملفات ذات الامتدادات (مثل .xlsx, .json, .png...)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!hasLocale(pathname) && pathname !== "/") {
    request.nextUrl.pathname = `/ar${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xlsx)$).*)"],
};