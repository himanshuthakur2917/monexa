import { hashToken } from "@/lib/utils/token";
import { verifyUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = new URL(req.url).searchParams;
        const token = body.get("token");
        if (!token) {
            return NextResponse.json(
                { message: "Token is required" },
                { status: 400 }
            );
        }
        const hashedToken = hashToken(token);

        const {user,updatedUser} = await verifyUser(hashedToken)

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Email verified successfully", user: updatedUser },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Error in Verifying User", error: error.message },
            { status: 500 }
        );
    }
}
