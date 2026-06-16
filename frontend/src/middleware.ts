import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/profile", "/orders", "/bookings", "/checkout", "/wishlist"];
const VENDOR_ROUTES = ["/vendor"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/register"];

function getTokenFromRequest(request: NextRequest): string | null {
  // Check cookie first (for SSR)
  const cookieToken = request.cookies.get("access_token")?.value;
  if (cookieToken) return cookieToken;
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromRequest(request);
  const isAuthenticated = !!token;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect customer routes
  if (!isAuthenticated && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect vendor routes
  if (VENDOR_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|og-image.png|manifest.json|icons|images).*)",
  ],
};
