import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/utils/token";
import { users } from "@/schemas/user.schema";
import { eq, getTableColumns } from "drizzle-orm";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("access_token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = await verifyAccessToken(token);

        const decoded = jwtDecode<{exp:number}>(token)
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

        const { password, ...rest } = getTableColumns(users);
        const [user] = await db
            .select({
                ...rest,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return NextResponse.json({ message:"User found",user:{name: `${user.firstName} ${user.lastName}`,email:user.email} , exp:expiresIn }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `Internal server error : ${error.message}` },
            { status: 500 }
        );
    }
}
