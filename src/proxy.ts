import { NextResponse, type NextRequest } from "next/server";

// Protected routes requiring an authenticated user
const PROTECTED_ROUTES = [
  "/add-book",
  "/my-books",
  "/my-borrows",
  "/profile",
];

// Auth routes where authenticated users can be redirected to home
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

/**
 * Next.js Proxy route protection handler.
 * Validates session against Better Auth session cookies,
 * safely redirecting unauthenticated users to /login while avoiding redirect loops.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If not a protected or auth route, pass through immediately
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Check Better Auth session token cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const hasSessionToken = Boolean(sessionCookie?.value);

  // Redirect unauthenticated user trying to access a protected page
  if (isProtectedRoute && !hasSessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user away from login/register to home (unless explicitly redirected with ?redirect)
  if (
    isAuthRoute &&
    hasSessionToken &&
    !request.nextUrl.searchParams.has("redirect")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, covers (public assets)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|images|covers|api).*)",
  ],
};
