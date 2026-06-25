import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/login", "/register", "/gmail", "/outlook", "/pricing", "/about", "/faq", "/forgot-password", "/reset-password", "/privacy", "/terms"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (!req.auth && !PUBLIC_PATHS.has(pathname) && !pathname.startsWith("/features/")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
