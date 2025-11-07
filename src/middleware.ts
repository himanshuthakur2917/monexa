import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export function middleware(req: NextRequest) {
  const publicPaths = ["/", "/login", "/register"];

  // Allow public pages
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Get Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, ACCESS_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Token invalid or expired
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply to all routes except static files and Next internal assets
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
