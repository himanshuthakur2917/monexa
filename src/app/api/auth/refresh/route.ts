import {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    verifyRefreshToken,
} from "@/lib/utils/token";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    if (!refreshToken)
        return NextResponse.json({ error: "No token" }, { status: 401 });

    try {
        const decodedToken = await verifyRefreshToken(refreshToken);
        const accessToken = await generateAccessToken(decodedToken) 

        const res = NextResponse.json({ accessToken }, { status: 200 });
        res.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: true,
        });
        console.log(res)
        return res;
    } catch (e) {
        return NextResponse.json(
            { message: `Token Refresh Error : ${e.message}` },
            { status: 400 }
        );
    }
}
