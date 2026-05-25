import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_AUTH_COOKIE } from "./lib/admin-session";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const adminSession = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;

  if (adminSession !== "true") {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*"],
};
