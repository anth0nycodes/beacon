import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Make sure to update this array as you add more routes
const PUBLIC_ROUTES = ["/", "/login", "/dashboard"];

export async function middleware(request: NextRequest) {
  try {
    const response = await updateSession(request);
    const isProd = process.env.NODE_ENV === "production";
    const showProd = process.env.FLAG_SHOW_PRODUCTION_PAGE === "true";
    const { pathname } = request.nextUrl;

    // In production, if flag is false, only allow public routes
    if (isProd && !showProd) {
      if (!PUBLIC_ROUTES.includes(pathname)) {
        const redirectResponse = NextResponse.redirect(new URL("/", request.url));
        // Copy headers from the session response to maintain session state
        response.headers.forEach((value, key) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
