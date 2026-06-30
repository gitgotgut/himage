import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Only the SSO callback is reachable without a session.
const PUBLIC_PATHS = new Set(["/sso/callback"]);

const HIFAMILY_URL = process.env.NEXT_PUBLIC_HIFAMILY_URL || "http://localhost:3000";
const SELF_URL = process.env.NEXT_PUBLIC_PHOTO_URL || "http://localhost:3003";

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  // CSRF defense-in-depth: reject cross-origin mutations against our API.
  if (req.method !== "GET" && req.method !== "HEAD" && pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== req.headers.get("host")) {
          return new NextResponse("Forbidden", { status: 403 });
        }
      } catch {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  if (req.auth || PUBLIC_PATHS.has(pathname)) return;

  // No session — hand off to hifamily SSO. It mints a token and bounces back
  // to our callback, which establishes a local session then resumes `next`.
  const callback = `${SELF_URL}/sso/callback?next=${encodeURIComponent(pathname + search)}`;
  const ssoUrl = `${HIFAMILY_URL}/sso?redirect=${encodeURIComponent(callback)}`;
  return NextResponse.redirect(ssoUrl);
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
