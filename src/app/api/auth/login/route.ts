
import { loginSchema } from "@/schemas/auth.schema";
import { loginUser } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = loginSchema.parse(body);

        const {accessToken,refreshToken} = await loginUser(data);

        
        
        
        const response = NextResponse.json(
            { message : "Logged In Successfully"},
            { status: 201 }
        );

        response.cookies.set("access_token", accessToken, {
            httpOnly:true,
            secure:true,
        })
        response.cookies.set("refresh_token", refreshToken, {
            httpOnly:true,
            secure:true,
        })

        return response

    } catch (error) {
        return NextResponse.json(
            { message : "Error in Log In User", error: error.message },
            { status: 400 }
        );
    }
}
