import { NextRequest, NextResponse } from "next/server";
import { JwtData } from "@/interfaces/tokens";
import redisClient from "@/lib/redisDB";
import { jwtDecode } from "jwt-decode";
export async function POST(req: NextRequest) {
    try {
        const cookie = req.headers.get("cookie")
        const refreshToken = cookie?.split("refresh_token=")[1];
        
        if (!refreshToken)
            NextResponse.json(
                { message: "Already Logged out" },
                { status: 200 }
            );

        const decodedToken = jwtDecode(refreshToken) as JwtData

        await redisClient.del(`refresh:${decodedToken.id}`)

        const response = NextResponse.json(
                { message: "Logged out" },
                { status: 200 }
            );

        // Remove the token cookie
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
       
        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Error logging out", error: error.message },
            { status: 500 }
        );
    }
}
