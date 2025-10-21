import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ 
        req: request,
        secret: process.env.JWT_SECRET   
    });
    
    const url = request.nextUrl;
    const pathname = url.pathname;


    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const protectedRoutes = ['/dashboard', '/profile', '/settings', '/admin'];
    const apiAuthRoutes = ['/api/auth'];

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isApiAuthRoute = apiAuthRoutes.some(route => pathname.startsWith(route));


    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (!token && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (token && isAuthRoute) {
        const callbackUrl = url.searchParams.get('callbackUrl');
        const redirectUrl = callbackUrl || '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    const response = NextResponse.next();
    
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    

    return response;
}

export const config = {
    matcher: [
        // Include all routes starting with these paths
        '/dashboard/:path*',
        '/profile/:path*',

        // Also include auth routes to redirect logged-in users
        '/login',
        '/register',
        '/forgot-password',
    ],
};