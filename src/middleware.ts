export const runtime = 'nodejs'

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const publicPaths = ["/", "/login", "/register"];

    // Allow public pages
    if (publicPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // Get tokens
    const accessToken = req.cookies.get("access_token")?.value;
    const refreshToken = req.cookies.get("refresh_token")?.value;

    // If no token, redirect to login
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin":
                    process.env.ALLOWED_ORIGIN || "*",
                "Access-Control-Allow-Methods":
                    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "86400", // 24 hours
            },
        });
    }

    // Handle actual request

    try {
        jwt.verify(accessToken, process.env.ACCESS_SECRET as string);

        const response = NextResponse.next();

        response.headers.set(
            "Access-Control-Allow-Origin",
            process.env.ALLOWED_ORIGIN || "*"
        );
        response.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        );
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        response.headers.set("Access-Control-Allow-Credentials", "true");

        return response;
    } catch(err) {
      console.log(err)
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// Apply to all routes except static files and Next internal assets
export const config = {
    matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
