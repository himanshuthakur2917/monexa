import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/sign-in', '/sign-up', '/verify', '/'];
    
    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard'];

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        url.pathname.startsWith(route)
    );

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
        url.pathname.startsWith(route)
    );

    // If user is not authenticated and tries to access protected route
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If user is authenticated and tries to access auth routes
    if (token && isPublicRoute && url.pathname !== '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow the request to continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
};
